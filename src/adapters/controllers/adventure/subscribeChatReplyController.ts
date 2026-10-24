import {
    ISubscribeChatReplyController,
    SubscribeChatReplyControllerRequest,
    SubscribeChatReplyControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISubscribeChatReplyUseCase } from '@domain/use-cases';
import { ChatReplyStatusEnum } from '@domain/providers';

export class SubscribeChatReplyController implements ISubscribeChatReplyController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISubscribeChatReplyUseCase
    ) { }

    handle (request: SubscribeChatReplyControllerRequest): SubscribeChatReplyControllerResponse {
        this.logger.info('Executing SubscribeChatReplyController::handle');
        this.logger.debug('SubscribeChatReplyController::handle - params', { adventureId: request.adventureId });

        const response = this.useCase.execute({
            adventureId: request.adventureId,
            listener: event => request.onUpdate({
                chatId: event.chatId,
                isFinished: event.status !== ChatReplyStatusEnum.STREAMING,
                isRemoved: event.status === ChatReplyStatusEnum.REMOVED,
                error: event.error,
            }),
        });

        return {
            success: response.success,
            isReplying: response.isReplying,
            unsubscribe: response.unsubscribe,
            error: response.error,
        };
    }
}
