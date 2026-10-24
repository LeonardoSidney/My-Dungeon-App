import { EraseConnectionControllerResponse, IEraseConnectionController, EraseConnectionControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseConnectionUseCase, EraseConnectionUseCaseReturn } from '@domain/use-cases';

export class EraseConnectionController implements IEraseConnectionController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseConnectionUseCase
    ) { }

    async handle (request: EraseConnectionControllerRequest): Promise<EraseConnectionControllerResponse> {
        this.logger.info('Executing EraseConnectionController::handle');
        this.logger.debug('EraseConnectionController::handle - params', request);
        const result: EraseConnectionUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
