import { EraseItemControllerResponse, IEraseItemController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseItemUseCase, EraseItemUseCaseReturn } from '@domain/use-cases';

export class EraseItemController implements IEraseItemController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEraseItemUseCase
    ) { }

    async handle (itemId: string): Promise<EraseItemControllerResponse> {
        this.logger.info('Executing EraseItemController::handle');
        const result: EraseItemUseCaseReturn = await this.useCase.execute(itemId);
        return { success: result.success, error: result.error };
    }
}
