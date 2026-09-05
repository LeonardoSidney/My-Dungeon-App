import { CreateAbilityControllerParams, CreateAbilityControllerResponse, ICreateAbilityController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateAbilityUseCase } from '@domain/use-cases';

export class CreateAbilityController implements ICreateAbilityController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateAbilityUseCase
    ) { }
    async handle (params: CreateAbilityControllerParams): Promise<CreateAbilityControllerResponse> {
        this.logger.info('Executing CreateAbilityController::handle');
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
