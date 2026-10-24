import { ILogger } from '@domain/logger';
import { IStreamSessionRegistry } from '@domain/providers';
import {
    IStopChatReplyUseCase,
    StopChatReplyUseCaseParams,
    StopChatReplyUseCaseReturn,
} from '@domain/use-cases';

export class StopChatReplyUseCase implements IStopChatReplyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly registry: IStreamSessionRegistry
    ) { }

    execute (params: StopChatReplyUseCaseParams): StopChatReplyUseCaseReturn {
        this.logger.info('Executing StopChatReplyUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        if (!this.registry.stop(params.adventureId)) {
            this.logger.warning('StopChatReplyUseCase::execute - no reply being generated', params.adventureId);
        }

        return { success: true };
    }

    private validate (params: StopChatReplyUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
