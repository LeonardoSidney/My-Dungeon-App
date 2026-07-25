import { EraseAbilityControllerResponse, IEraseAbilityController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseAbilityUseCase, EraseAbilityUseCaseReturn } from '@domain/use-cases';

export class EraseAbilityController implements IEraseAbilityController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseAbilityUseCase
    ) { }

    async handle (abilityId: string): Promise<EraseAbilityControllerResponse> {
        this.logger.info('Executing EraseAbilityController::handle');
        const result: EraseAbilityUseCaseReturn = await this.useCase.execute(abilityId);
        return { success: result.success, error: result.error };
    }
}
