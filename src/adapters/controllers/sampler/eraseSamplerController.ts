import { EraseSamplerControllerResponse, IEraseSamplerController, EraseSamplerControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { EraseSamplerUseCaseReturn, IEraseSamplerUseCase } from '@domain/use-cases';

export class EraseSamplerController implements IEraseSamplerController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseSamplerUseCase
    ) { }

    async handle (request: EraseSamplerControllerRequest): Promise<EraseSamplerControllerResponse> {
        this.logger.info('Executing EraseSamplerController::handle');
        this.logger.debug('EraseSamplerController::handle - params', request);
        const result: EraseSamplerUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
