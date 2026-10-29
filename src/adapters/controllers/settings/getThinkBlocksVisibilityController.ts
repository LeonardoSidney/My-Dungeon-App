import { GetThinkBlocksVisibilityControllerResponse, IGetThinkBlocksVisibilityController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetThinkBlocksVisibilityUseCase } from '@domain/use-cases';

export class GetThinkBlocksVisibilityController implements IGetThinkBlocksVisibilityController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetThinkBlocksVisibilityUseCase
    ) { }

    async handle (): Promise<GetThinkBlocksVisibilityControllerResponse> {
        this.logger.info('Executing GetThinkBlocksVisibilityController::handle');
        return this.useCase.execute();
    }
}
