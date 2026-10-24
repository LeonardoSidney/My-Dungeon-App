import { EraseWorldMasterControllerResponse, IEraseWorldMasterController, EraseWorldMasterControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseWorldMasterUseCase, EraseWorldMasterUseCaseReturn } from '@domain/use-cases';

export class EraseWorldMasterController implements IEraseWorldMasterController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseWorldMasterUseCase
    ) { }

    async handle (request: EraseWorldMasterControllerRequest): Promise<EraseWorldMasterControllerResponse> {
        this.logger.info('Executing EraseWorldMasterController::handle');
        this.logger.debug('EraseWorldMasterController::handle - params', request);
        const result: EraseWorldMasterUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
