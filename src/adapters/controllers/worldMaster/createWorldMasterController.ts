import { CreateWorldMasterControllerParams, CreateWorldMasterControllerResponse, ICreateWorldMasterController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateWorldMasterUseCase } from '@domain/use-cases';

export class CreateWorldMasterController implements ICreateWorldMasterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateWorldMasterUseCase
    ) { }
    async handle (params: CreateWorldMasterControllerParams): Promise<CreateWorldMasterControllerResponse> {
        this.logger.info('Executing CreateWorldMasterController::handle');
        const { name, activationWord, prompt, observation, assistantId } = params;
        const response = await this.useCase.execute({
            name,
            activationWord,
            prompt,
            observation,
            assistantId
        });

        return {
            success: response.success,
            worldMaster: response.worldMaster,
            error: response.error
        };
    }
}
