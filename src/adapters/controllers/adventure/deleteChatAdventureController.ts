import {
    IDeleteChatAdventureController,
    DeleteChatControllerRequest,
    DeleteChatControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IDeleteChatAdventureUseCase } from '@domain/use-cases';

export class DeleteChatAdventureController implements IDeleteChatAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IDeleteChatAdventureUseCase
    ) { }

    async handle (request: DeleteChatControllerRequest): Promise<DeleteChatControllerResponse> {
        this.logger.info('Executing DeleteChatAdventureController::handle');
        this.logger.debug('DeleteChatAdventureController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
