import {
    IDeleteChatVersionController,
    DeleteChatVersionControllerRequest,
    DeleteChatVersionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IDeleteChatVersionUseCase } from '@domain/use-cases';

export class DeleteChatVersionController implements IDeleteChatVersionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IDeleteChatVersionUseCase
    ) { }

    async handle (request: DeleteChatVersionControllerRequest): Promise<DeleteChatVersionControllerResponse> {
        this.logger.info('Executing DeleteChatVersionController::handle');
        this.logger.debug('DeleteChatVersionController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
