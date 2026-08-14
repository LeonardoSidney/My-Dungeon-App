import {
    IUpdateStreamingChatController,
    UpdateStreamingChatControllerRequest,
    UpdateStreamingChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IUpdateStreamingChatUseCase } from '@domain/use-cases';

export class UpdateStreamingChatController implements IUpdateStreamingChatController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IUpdateStreamingChatUseCase
    ) {}

    async handle (request: UpdateStreamingChatControllerRequest): Promise<UpdateStreamingChatControllerResponse> {
        this.logger.info('Executing UpdateStreamingChatController::handle');
        this.logger.debug('UpdateStreamingChatController::handle - request', request);

        const response = await this.useCase.execute({
            adventure: request.adventure,
            chatId: request.chatId,
            content: request.content,
            think: request.think,
        });

        return {
            success: response.success,
            chat: response.chat,
            adventure: response.adventure,
            error: response.error,
        };
    }
}
