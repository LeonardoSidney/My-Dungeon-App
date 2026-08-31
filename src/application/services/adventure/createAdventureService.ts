import { MINIMUM_NUMBER_SYSTEM_PROMPT, MINIMUM_PLAYABLE_CHARACTERS, MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM } from '@domain/constants/adventure';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { CreateAdventureServiceParams, CreateAdventureServiceReturn, ICreateAdventureService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateAdventureService implements ICreateAdventureService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    createAdventure (params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        this.logger.info('Executing CreateAdventureService', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        if (!params.worldMasterId) {
            const withoutWorldMasterError = this.validateWithoutWorldMaster(params);
            if (withoutWorldMasterError) {
                return { success: false, error: withoutWorldMasterError };
            }
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

    private validate (params: CreateAdventureServiceParams): string | null {
        if (params.characterIds.length < MINIMUM_PLAYABLE_CHARACTERS) {
            return `You need at least ${MINIMUM_PLAYABLE_CHARACTERS} to create an adventure`;
        }

        if (params.systemPromptIds.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            return 'A system prompt is required to create an adventure';
        }

        return null;
    }

    private validateWithoutWorldMaster (params: CreateAdventureServiceParams): string | null {
        if (params.characterIds.length < MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM) {
            return `Need at least ${MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM} characters to create an adventure without a world master`;
        }

        if (!params.characterAsWorldMasterId) {
            return 'At least one character must be controlled by the AI when creating an adventure without a world master';
        }

        return null;
    }
}
