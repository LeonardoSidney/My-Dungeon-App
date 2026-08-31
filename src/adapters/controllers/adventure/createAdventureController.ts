import { CreateAdventureRequest, CreateAdventureResponse, ICreateAdventureController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateAdventureUseCase } from '@domain/use-cases';

export class CreateAdventureController implements ICreateAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ICreateAdventureUseCase
    ) { }
    async handle (request: CreateAdventureRequest): Promise<CreateAdventureResponse> {
        this.logger.info('Executing CreateAdventureController::handle');
        const { systemPromptIds, characterIds, worldMasterId, characterAsWorldMasterId, charactersControlledByAi, worldIds, locationIds, itemIds, name } = request;
        const response = await this.useCase.execute({
            name,
            systemPromptIds,
            characterIds,
            worldMasterId,
            characterAsWorldMasterId,
            charactersControlledByAi,
            worldIds,
            locationIds,
            itemIds
        });

        return {
            success: response.success,
            adventure: response.adventure,
            error: response.error
        };
    }
}
