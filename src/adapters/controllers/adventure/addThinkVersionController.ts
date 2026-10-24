import {
    IAddThinkVersionController,
    AddThinkVersionControllerRequest,
    AddThinkVersionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IAddThinkVersionUseCase } from '@domain/use-cases';

export class AddThinkVersionController implements IAddThinkVersionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IAddThinkVersionUseCase
    ) { }

    async handle (request: AddThinkVersionControllerRequest): Promise<AddThinkVersionControllerResponse> {
        this.logger.info('Executing AddThinkVersionController::handle');
        this.logger.debug('AddThinkVersionController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
