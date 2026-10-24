import { EraseItemControllerResponse, IEraseItemController, EraseItemControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseItemUseCase, EraseItemUseCaseReturn } from '@domain/use-cases';

export class EraseItemController implements IEraseItemController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEraseItemUseCase
    ) { }

    async handle (request: EraseItemControllerRequest): Promise<EraseItemControllerResponse> {
        this.logger.info('Executing EraseItemController::handle');
        this.logger.debug('EraseItemController::handle - params', request);
        const result: EraseItemUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
