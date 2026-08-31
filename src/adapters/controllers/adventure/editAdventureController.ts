import {
    EditAdventureControllerRequest,
    EditAdventureControllerResponse,
    IEditAdventureController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditAdventureUseCase } from '@domain/use-cases';

export class EditAdventureController implements IEditAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditAdventureUseCase
    ) { }

    async handle (request: EditAdventureControllerRequest): Promise<EditAdventureControllerResponse> {
        this.logger.info('Executing EditAdventureController::handle');
        const { id, name, systemPromptIds, characterIds, worldMasterId, characterAsWorldMasterId, charactersControlledByAi, worldIds, locationIds, itemIds, chat, createdAt } = request;
        const response = await this.useCase.execute({
            id,
            name,
            systemPromptIds,
            characterIds,
            worldMasterId,
            characterAsWorldMasterId,
            charactersControlledByAi,
            worldIds,
            locationIds,
            itemIds,
            chat,
            createdAt
        });

        return {
            success: response.success,
            adventure: response.adventure,
            error: response.error
        };
    }
}
