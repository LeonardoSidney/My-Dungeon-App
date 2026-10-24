import { EraseLocationControllerResponse, IEraseLocationController, EraseLocationControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseLocationUseCase, EraseLocationUseCaseReturn } from '@domain/use-cases';

export class EraseLocationController implements IEraseLocationController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEraseLocationUseCase
    ) { }

    async handle (request: EraseLocationControllerRequest): Promise<EraseLocationControllerResponse> {
        this.logger.info('Executing EraseLocationController::handle');
        this.logger.debug('EraseLocationController::handle - params', request);
        const result: EraseLocationUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
