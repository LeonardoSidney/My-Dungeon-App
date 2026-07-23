import { EraseProficiencyControllerResponse, IEraseProficiencyController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseProficiencyUseCase, EraseProficiencyUseCaseReturn } from '@domain/use-cases';

export class EraseProficiencyController implements IEraseProficiencyController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseProficiencyUseCase
    ) { }

    async handle (proficiencyId: string): Promise<EraseProficiencyControllerResponse> {
        this.logger.info('Executing EraseProficiencyController::handle');
        const result: EraseProficiencyUseCaseReturn = await this.useCase.execute(proficiencyId);
        return { success: result.success, error: result.error };
    }
}
