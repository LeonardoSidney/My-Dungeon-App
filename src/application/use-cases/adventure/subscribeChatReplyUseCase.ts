import { ILogger } from '@domain/logger';
import { IChatReplyChannel, IStreamSessionRegistry } from '@domain/providers';
import {
    ISubscribeChatReplyUseCase,
    SubscribeChatReplyUseCaseParams,
    SubscribeChatReplyUseCaseReturn,
} from '@domain/use-cases';

export class SubscribeChatReplyUseCase implements ISubscribeChatReplyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly channel: IChatReplyChannel,
        private readonly registry: IStreamSessionRegistry
    ) { }

    execute (params: SubscribeChatReplyUseCaseParams): SubscribeChatReplyUseCaseReturn {
        this.logger.info('Executing SubscribeChatReplyUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const unsubscribe = this.channel.subscribe(params.adventureId, params.listener);

        return {
            success: true,
            isReplying: this.registry.isActive(params.adventureId),
            unsubscribe,
        };
    }

    private validate (params: SubscribeChatReplyUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
