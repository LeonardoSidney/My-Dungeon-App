import {
    GenerateChatReplyControllerRequest,
    GenerateChatReplyControllerResponse,
    IGenerateChatReplyController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGenerateChatReplyUseCase } from '@domain/use-cases';

export class GenerateChatReplyController implements IGenerateChatReplyController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGenerateChatReplyUseCase
    ) { }

    async handle (request: GenerateChatReplyControllerRequest): Promise<GenerateChatReplyControllerResponse> {
        this.logger.info('Executing GenerateChatReplyController::handle');
        this.logger.debug('GenerateChatReplyController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            chatId: response.chatId,
            error: response.error,
        };
    }
}
