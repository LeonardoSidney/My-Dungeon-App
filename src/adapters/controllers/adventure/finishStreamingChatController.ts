import {
    IFinishStreamingChatController,
    FinishStreamingChatControllerRequest,
    FinishStreamingChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IFinishStreamingChatUseCase } from '@domain/use-cases';

export class FinishStreamingChatController implements IFinishStreamingChatController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IFinishStreamingChatUseCase
    ) {}

    async handle (request: FinishStreamingChatControllerRequest): Promise<FinishStreamingChatControllerResponse> {
        this.logger.info('Executing FinishStreamingChatController::handle');
        this.logger.debug('FinishStreamingChatController::handle - request', request);

        const response = await this.useCase.execute({
            adventure: request.adventure,
            chatId: request.chatId,
        });

        return {
            success: response.success,
            chat: response.chat,
            adventure: response.adventure,
            error: response.error,
        };
    }
}
