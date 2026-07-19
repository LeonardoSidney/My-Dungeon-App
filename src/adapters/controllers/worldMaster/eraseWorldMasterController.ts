import { EraseWorldMasterControllerResponse, IEraseWorldMasterController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseWorldMasterUseCase, EraseWorldMasterUseCaseReturn } from '@domain/use-cases';

export class EraseWorldMasterController implements IEraseWorldMasterController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseWorldMasterUseCase
    ) { }

    async handle (worldMasterId: string): Promise<EraseWorldMasterControllerResponse> {
        this.logger.info('Executing EraseWorldMasterController::handle');
        const result: EraseWorldMasterUseCaseReturn = await this.useCase.execute(worldMasterId);
        return { success: result.success, error: result.error };
    }
}
