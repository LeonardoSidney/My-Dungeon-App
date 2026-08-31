import { CreateCharacterControllerPrams, CreateCharacterControllerResponse, ICreateCharacterController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateCharacterUseCase } from '@domain/use-cases';

export class CreateCharacterController implements ICreateCharacterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateCharacterUseCase
    ) { }
    async handle (params: CreateCharacterControllerPrams): Promise<CreateCharacterControllerResponse> {
        this.logger.info('Executing CreateCharacterController::handle');
        const { name, activationWord, prompt, observation, abilityIds, proficiencyIds, statusIds, attributes, assistantId } = params;
        const response = await this.useCase.execute({
            name,
            activationWord,
            prompt,
            observation,
            abilityIds,
            proficiencyIds,
            statusIds,
            attributes,
            assistantId
        });

        return {
            success: response.success,
            character: response.character,
            error: response.error
        };
    }
}
