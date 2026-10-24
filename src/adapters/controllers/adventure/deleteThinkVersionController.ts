import {
    IDeleteThinkVersionController,
    DeleteThinkControllerRequest,
    DeleteThinkControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IDeleteThinkVersionUseCase } from '@domain/use-cases';

export class DeleteThinkVersionController implements IDeleteThinkVersionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IDeleteThinkVersionUseCase
    ) { }

    async handle (request: DeleteThinkControllerRequest): Promise<DeleteThinkControllerResponse> {
        this.logger.info('Executing DeleteThinkVersionController::handle');
        this.logger.debug('DeleteThinkVersionController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
