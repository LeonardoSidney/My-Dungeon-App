import { EraseProficiencyControllerResponse, IEraseProficiencyController, EraseProficiencyControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseProficiencyUseCase, EraseProficiencyUseCaseReturn } from '@domain/use-cases';

export class EraseProficiencyController implements IEraseProficiencyController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseProficiencyUseCase
    ) { }

    async handle (request: EraseProficiencyControllerRequest): Promise<EraseProficiencyControllerResponse> {
        this.logger.info('Executing EraseProficiencyController::handle');
        this.logger.debug('EraseProficiencyController::handle - params', request);
        const result: EraseProficiencyUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
