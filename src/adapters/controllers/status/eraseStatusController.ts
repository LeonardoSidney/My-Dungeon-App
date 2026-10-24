import { EraseStatusControllerResponse, IEraseStatusController, EraseStatusControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseStatusUseCase, EraseStatusUseCaseReturn } from '@domain/use-cases';

export class EraseStatusController implements IEraseStatusController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseStatusUseCase
    ) { }

    async handle (request: EraseStatusControllerRequest): Promise<EraseStatusControllerResponse> {
        this.logger.info('Executing EraseStatusController::handle');
        this.logger.debug('EraseStatusController::handle - params', request);
        const result: EraseStatusUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
