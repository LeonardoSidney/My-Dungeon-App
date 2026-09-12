import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { CreateAdventureServiceParams, CreateAdventureServiceReturn, ICreateAdventureService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';
import { validateAdventureCharacterSelection } from '@application/shared/adventureCharacterRules';

export class CreateAdventureService implements ICreateAdventureService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    createAdventure (params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        this.logger.info('Executing CreateAdventureService', params);

        const validationError = validateAdventureCharacterSelection(params, params.systemPromptIds.length);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const { name, systemPromptIds, characterIds, worldMasterId, characterAsWorldMasterId, charactersControlledByAi, worldIds, locationIds, itemIds } = params;

        const createdAt = new Date();
        const adventure: Adventure = {
            id: this.idGenerate.generate(),
            name,
            chat: [],
            systemPromptIds,
            characterIds,
            worldMasterId,
            characterAsWorldMasterId,
            charactersControlledByAi,
            worldIds,
            locationIds,
            itemIds,
            createdAt: createdAt,
            updatedAt: createdAt
        };

        return {
            success: true,
            adventure
        };
    }
}
