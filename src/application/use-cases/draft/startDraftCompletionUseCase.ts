import { ILogger } from '@domain/logger';
import { DraftStatus, DraftStatusEnum, IDraftChannel, IStreamSessionRegistry } from '@domain/providers';
import { IDraftRepository, SaveDraftRepositoryReturn } from '@domain/repository';
import { IWriteDraftService } from '@domain/services';
import {
    DraftCompletionOutcome,
    DraftCompletionSession,
    IStartDraftCompletionUseCase,
    IStreamPromptCompletionUseCase,
    StartDraftCompletionUseCaseParams,
    StartDraftCompletionUseCaseReturn,
} from '@domain/use-cases';

const DEFAULT_THROTTLE_MS = 100;
const ALREADY_STREAMING_ERROR = 'A completion is already streaming for this draft';

export class StartDraftCompletionUseCase implements IStartDraftCompletionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly draftRepository: IDraftRepository,
        private readonly writeDraftService: IWriteDraftService,
        private readonly streamPromptCompletionUseCase: IStreamPromptCompletionUseCase,
        private readonly channel: IDraftChannel,
        private readonly registry: IStreamSessionRegistry,
        private readonly throttleMs: number = DEFAULT_THROTTLE_MS
    ) { }

    async execute (params: StartDraftCompletionUseCaseParams): Promise<StartDraftCompletionUseCaseReturn> {
        this.logger.info('Executing StartDraftCompletionUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        if (this.registry.isActive(params.draftId)) {
            return { success: false, error: ALREADY_STREAMING_ERROR };
        }

        const existing = await this.draftRepository.getDraftById(params.draftId);
        if (!existing.success) {
            this.logger.warning('StartDraftCompletionUseCase::execute - failed to load draft', existing.error);
            return { success: false, error: existing.error };
        }

        const completion = await this.streamPromptCompletionUseCase.execute({ prompt: params.prompt });
        if (!completion.success || !completion.stream) {
            return { success: false, error: completion.error ?? 'Failed to start stream completion' };
        }

        let aborted = false;
        const abort = (): void => {
            aborted = true;
            completion.abort?.();
        };

        if (!this.registry.start(params.draftId, abort)) {
            completion.abort?.();
            return { success: false, error: ALREADY_STREAMING_ERROR };
        }

        const draft = this.writeDraftService.write({ draftId: params.draftId, content: params.prompt, existing: existing.draft });
        const saved = await this.draftRepository.saveDraft({ draft });
        if (!saved.success) {
            this.registry.release(params.draftId);
            completion.abort?.();
            return { success: false, error: saved.error ?? 'Failed to save draft' };
        }

        const session: DraftCompletionSession = {
            draftId: params.draftId,
            prompt: params.prompt,
            draft,
            tokens: completion.stream,
            isAborted: () => aborted,
        };

        this.notify(session, DraftStatusEnum.STREAMING);
        this.runCompletion(session);

        return { success: true };
    }

    private async runCompletion (session: DraftCompletionSession): Promise<void> {
        let outcome: DraftCompletionOutcome;
        try {
            outcome = await this.streamCompletion(session);
        } catch (error) {
            this.logger.error('StartDraftCompletionUseCase::runCompletion - completion failed unexpectedly', error);
            outcome = { error: 'Failed to stream response' };
        }

        this.registry.release(session.draftId);
        this.notify(session, DraftStatusEnum.IDLE, outcome.error);
    }

    private async streamCompletion (session: DraftCompletionSession): Promise<DraftCompletionOutcome> {
        let currentText = session.prompt;
        let lastUpdateTime = Date.now();
        let interruption: string | undefined;

        try {
            for await (const token of session.tokens) {
                if (session.isAborted()) break;
                currentText += token;

                const now = Date.now();
                if (now - lastUpdateTime < this.throttleMs) continue;
                lastUpdateTime = now;

                const saved = await this.save(session, currentText);
                if (saved.success) {
                    this.notify(session, DraftStatusEnum.STREAMING);
                }
            }
        } catch (error) {
            this.logger.warning('StartDraftCompletionUseCase::streamCompletion - model stream interrupted', error);
            interruption = error instanceof Error ? error.message : 'Failed to stream response';
        }

        const saved = await this.save(session, currentText);
        if (!saved.success) {
            this.logger.error('StartDraftCompletionUseCase::streamCompletion - failed to save final draft', saved.error);
            return { error: saved.error ?? 'Failed to save draft' };
        }

        return { error: interruption };
    }

    private save (session: DraftCompletionSession, content: string): Promise<SaveDraftRepositoryReturn> {
        const draft = this.writeDraftService.write({ draftId: session.draftId, content, existing: session.draft });
        return this.draftRepository.saveDraft({ draft });
    }

    private notify (session: DraftCompletionSession, status: DraftStatus, error?: string): void {
        this.channel.publish({ draftId: session.draftId, status, error });
    }

    private validate (params: StartDraftCompletionUseCaseParams): string | null {
        if (!params.draftId?.trim()) {
            return 'Draft id is required';
        }

        if (!params.prompt?.trim()) {
            return 'Prompt is required';
        }

        return null;
    }
}
