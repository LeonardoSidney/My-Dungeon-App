import {
    ISaveThinkBlocksVisibilityController,
    SaveThinkBlocksVisibilityControllerRequest,
    SaveThinkBlocksVisibilityControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISaveThinkBlocksVisibilityUseCase } from '@domain/use-cases';

export class SaveThinkBlocksVisibilityController implements ISaveThinkBlocksVisibilityController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISaveThinkBlocksVisibilityUseCase
    ) { }

    async handle (request: SaveThinkBlocksVisibilityControllerRequest): Promise<SaveThinkBlocksVisibilityControllerResponse> {
        this.logger.info('Executing SaveThinkBlocksVisibilityController::handle');
        this.logger.debug('SaveThinkBlocksVisibilityController::handle - params', request);
        return this.useCase.execute(request);
    }
}
