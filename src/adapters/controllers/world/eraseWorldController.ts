import { EraseWorldControllerResponse, IEraseWorldController, EraseWorldControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseWorldUseCase, EraseWorldUseCaseReturn } from '@domain/use-cases';

export class EraseWorldController implements IEraseWorldController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseWorldUseCase
    ) { }

    async handle (request: EraseWorldControllerRequest): Promise<EraseWorldControllerResponse> {
        this.logger.info('Executing EraseWorldController::handle');
        this.logger.debug('EraseWorldController::handle - params', request);
        const result: EraseWorldUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
