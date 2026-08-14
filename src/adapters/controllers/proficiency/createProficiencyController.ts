import { CreateProficiencyControllerParams, CreateProficiencyControllerResponse, ICreateProficiencyController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateProficiencyUseCase } from '@domain/use-cases';

export class CreateProficiencyController implements ICreateProficiencyController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateProficiencyUseCase
    ) { }
    async handle (params: CreateProficiencyControllerParams): Promise<CreateProficiencyControllerResponse> {
        this.logger.info('Executing CreateProficiencyController::handle');
        const { name, prompt, activationWord, observation } = params;
        const response = await this.useCase.execute({
            name,
            prompt,
            activationWord,
            observation
        });

        return response;
    }
}
