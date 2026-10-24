import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { CreateAdventureServiceParams, CreateAdventureServiceReturn, ICreateAdventureService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';
import { buildAdventureCharacterIds, validateAdventureCharacterSelection } from '@application/shared/adventureCharacterRules';

export class CreateAdventureService implements ICreateAdventureService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    createAdventure (params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        this.logger.info('Executing CreateAdventureService', params);

        const characterIds = buildAdventureCharacterIds({
            playableCharacterIds: params.playableCharacterIds,
            characterAsWorldMasterId: params.characterAsWorldMasterId,
            charactersControlledByAi: params.aiControlledCharacterIds,
        });
        const roster = {
            characterIds,
            worldMasterId: params.worldMasterId,
            characterAsWorldMasterId: params.characterAsWorldMasterId,
            charactersControlledByAi: params.aiControlledCharacterIds,
        };

        const validationError = validateAdventureCharacterSelection(roster, params.systemPromptIds.length);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const createdAt = new Date();
        const adventure: Adventure = {
            id: this.idGenerate.generate(),
            name: params.name,
            chat: [],
            systemPromptIds: params.systemPromptIds,
            ...roster,
            worldIds: params.worldIds,
            locationIds: params.locationIds,
            itemIds: params.itemIds,
            createdAt: createdAt,
            updatedAt: createdAt
        };

        return {
            success: true,
            adventure
        };
    }
}
