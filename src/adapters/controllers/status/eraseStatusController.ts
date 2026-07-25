import { EraseStatusControllerResponse, IEraseStatusController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseStatusUseCase, EraseStatusUseCaseReturn } from '@domain/use-cases';

export class EraseStatusController implements IEraseStatusController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseStatusUseCase
    ) { }

    async handle (statusId: string): Promise<EraseStatusControllerResponse> {
        this.logger.info('Executing EraseStatusController::handle');
        const result: EraseStatusUseCaseReturn = await this.useCase.execute(statusId);
        return { success: result.success, error: result.error };
    }
}
