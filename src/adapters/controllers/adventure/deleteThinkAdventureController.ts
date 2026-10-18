import {
    IDeleteThinkAdventureController,
    DeleteThinkControllerRequest,
    DeleteThinkControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IDeleteThinkAdventureUseCase } from '@domain/use-cases';

export class DeleteThinkAdventureController implements IDeleteThinkAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IDeleteThinkAdventureUseCase
    ) { }

    async handle (request: DeleteThinkControllerRequest): Promise<DeleteThinkControllerResponse> {
        this.logger.info('Executing DeleteThinkAdventureController::handle');
        this.logger.debug('DeleteThinkAdventureController::handle - request', {
            chatId: request.chatId,
            index: request.index,
        });

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            chat: response.chat,
            adventure: response.adventure,
            error: response.error,
        };
    }
}
