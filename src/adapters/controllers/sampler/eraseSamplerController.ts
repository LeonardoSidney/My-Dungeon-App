import { EraseSamplerControllerResponse, IEraseSamplerController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { EraseSamplerUseCaseReturn, IEraseSamplerUseCase } from '@domain/use-cases';

export class EraseSamplerController implements IEraseSamplerController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseSamplerUseCase
    ) { }

    async handle (samplerId: string): Promise<EraseSamplerControllerResponse> {
        this.logger.info('Executing EraseSamplerController::handle');
        const result: EraseSamplerUseCaseReturn = await this.useCase.execute(samplerId);
        return { success: result.success, error: result.error };
    }
}
