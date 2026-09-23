import {
    IResendChatController,
    ResendChatControllerRequest,
    ResendChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IResendChatUseCase } from '@domain/use-cases';

export class ResendChatController implements IResendChatController {
    constructor (
    private readonly logger: ILogger,
    private readonly useCase: IResendChatUseCase
    ) { }

    async handle (request: ResendChatControllerRequest): Promise<ResendChatControllerResponse> {
        this.logger.info('Executing ResendChatController::handle');
        this.logger.debug('ResendChatController::handle - request', {
            chatId: request.chatId,
        });

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            adventure: response.adventure,
            error: response.error,
        };
    }
}
