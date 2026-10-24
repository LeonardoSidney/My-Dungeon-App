import { EraseAbilityControllerResponse, IEraseAbilityController, EraseAbilityControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseAbilityUseCase, EraseAbilityUseCaseReturn } from '@domain/use-cases';

export class EraseAbilityController implements IEraseAbilityController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseAbilityUseCase
    ) { }

    async handle (request: EraseAbilityControllerRequest): Promise<EraseAbilityControllerResponse> {
        this.logger.info('Executing EraseAbilityController::handle');
        this.logger.debug('EraseAbilityController::handle - params', request);
        const result: EraseAbilityUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
