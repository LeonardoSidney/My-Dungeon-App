import { CreateStatusControllerParams, CreateStatusControllerResponse, ICreateStatusController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateStatusUseCase } from '@domain/use-cases';

export class CreateStatusController implements ICreateStatusController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateStatusUseCase
    ) { }
    async handle (params: CreateStatusControllerParams): Promise<CreateStatusControllerResponse> {
        this.logger.info('Executing CreateStatusController::handle');
        this.logger.debug('CreateStatusController::handle - params', params);
        const { name, prompt, activationWord, observation } = params;
        const response = await this.useCase.execute({
            name,
            prompt,
            activationWord,
            observation
        });

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
