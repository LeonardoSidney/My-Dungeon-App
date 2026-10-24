import { ILogger } from '@domain/logger';
import { DraftStatusEnum, IDraftChannel, IStreamSessionRegistry } from '@domain/providers';
import { IDraftRepository } from '@domain/repository';
import { IWriteDraftService } from '@domain/services';
import { ISaveDraftUseCase, SaveDraftUseCaseParams, SaveDraftUseCaseReturn } from '@domain/use-cases';

export class SaveDraftUseCase implements ISaveDraftUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly draftRepository: IDraftRepository,
        private readonly writeDraftService: IWriteDraftService,
        private readonly channel: IDraftChannel,
        private readonly registry: IStreamSessionRegistry
    ) { }

    async execute (params: SaveDraftUseCaseParams): Promise<SaveDraftUseCaseReturn> {
        this.logger.info('Executing SaveDraftUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        if (this.isCompleting(params.draftId)) {
            return { success: true };
        }

        const existing = await this.draftRepository.getDraftById(params.draftId);
        if (!existing.success) {
            this.logger.warning('SaveDraftUseCase::execute - failed to load draft', existing.error);
            return { success: false, error: existing.error };
        }

        if (params.onlyIfMissing && existing.draft) {
            return { success: true };
        }

        if (this.isCompleting(params.draftId)) {
            return { success: true };
        }

        const draft = this.writeDraftService.write({ draftId: params.draftId, content: params.content, existing: existing.draft });
        const saved = await this.draftRepository.saveDraft({ draft });
        if (!saved.success) {
            this.logger.error('SaveDraftUseCase::execute - failed to save draft', saved.error);
            return { success: false, error: saved.error };
        }

        this.channel.publish({ draftId: params.draftId, status: DraftStatusEnum.IDLE });
        return { success: true };
    }

    private isCompleting (draftId: string): boolean {
        if (!this.registry.isActive(draftId)) {
            return false;
        }

        this.logger.info('SaveDraftUseCase::execute - a completion owns the draft, edit skipped', draftId);
        return true;
    }

    private validate (params: SaveDraftUseCaseParams): string | null {
        if (!params.draftId?.trim()) {
            return 'Draft id is required';
        }

        if (typeof params.content !== 'string') {
            return 'Draft content is required';
        }

        return null;
    }
}
