import {
    IContinueFromChatController,
    ContinueFromChatControllerRequest,
    ContinueFromChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IContinueFromChatUseCase } from '@domain/use-cases';

export class ContinueFromChatController implements IContinueFromChatController {
    constructor (
    private readonly logger: ILogger,
    private readonly useCase: IContinueFromChatUseCase
    ) { }

    async handle (request: ContinueFromChatControllerRequest): Promise<ContinueFromChatControllerResponse> {
        this.logger.info('Executing ContinueFromChatController::handle');
        this.logger.debug('ContinueFromChatController::handle - request', {
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
