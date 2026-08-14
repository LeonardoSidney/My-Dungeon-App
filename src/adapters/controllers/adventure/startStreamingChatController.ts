import {
    IStartStreamingChatController,
    StartStreamingChatControllerRequest,
    StartStreamingChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IStartStreamingChatUseCase } from '@domain/use-cases';

export class StartStreamingChatController implements IStartStreamingChatController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IStartStreamingChatUseCase
    ) {}

    async handle (request: StartStreamingChatControllerRequest): Promise<StartStreamingChatControllerResponse> {
        this.logger.info('Executing StartStreamingChatController::handle');
        this.logger.debug('StartStreamingChatController::handle - request', request);

        const response = await this.useCase.execute({
            adventure: request.adventure,
            role: request.role,
            characterName: request.characterName,
        });

        return {
            success: response.success,
            chat: response.chat,
            adventure: response.adventure,
            error: response.error,
        };
    }
}
