import { CreateAssistantControllerParams, CreateAssistantControllerResponse, ICreateAssistantController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateAssistantUseCase } from '@domain/use-cases';

export class CreateAssistantController implements ICreateAssistantController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateAssistantUseCase
    ) { }
    async handle (params: CreateAssistantControllerParams): Promise<CreateAssistantControllerResponse> {
        this.logger.info('Executing CreateAssistantController::handle');
        const { name, observation, model, sampler } = params;
        const response = await this.useCase.execute({
            name,
            observation,
            model,
            sampler
        });

        return {
            success: response.success,
            assistant: response.assistant,
            error: response.error
        };
    }
}
