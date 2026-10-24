import { ILogger } from '@domain/logger';
import { IStreamSessionRegistry } from '@domain/providers';
import {
    IStopDraftCompletionUseCase,
    StopDraftCompletionUseCaseParams,
    StopDraftCompletionUseCaseReturn,
} from '@domain/use-cases';

export class StopDraftCompletionUseCase implements IStopDraftCompletionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly registry: IStreamSessionRegistry
    ) { }

    execute (params: StopDraftCompletionUseCaseParams): StopDraftCompletionUseCaseReturn {
        this.logger.info('Executing StopDraftCompletionUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        if (!this.registry.stop(params.draftId)) {
            this.logger.warning('StopDraftCompletionUseCase::execute - no completion streaming', params.draftId);
        }

        return { success: true };
    }

    private validate (params: StopDraftCompletionUseCaseParams): string | null {
        if (!params.draftId?.trim()) {
            return 'Draft id is required';
        }

        return null;
    }
}
