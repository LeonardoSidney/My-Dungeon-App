import { MINIMUM_NUMBER_SYSTEM_PROMPT, MINIMUM_PLAYABLE_CHARACTERS, MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM } from '@domain/constants/adventure';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAdventureServiceParams, EditAdventureServiceReturn, IEditAdventureService } from '@domain/services';

export class EditAdventureService implements IEditAdventureService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn {
        this.logger.info('Executing EditAdventureService::editAdventure');
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

        const { id, name, systemPromptIds, characterIds, worldMasterId, characterAsWorldMasterId, charactersControlledByAi, worldIds, locationIds, itemIds, chat, createdAt } = params;

        const adventure: Adventure = {
            id,
            name,
            chat,
            systemPromptIds,
            characterIds,
            worldMasterId,
            characterAsWorldMasterId,
            charactersControlledByAi,
            worldIds,
            locationIds,
            itemIds,
            createdAt,
            updatedAt: new Date()
        };

        return {
            success: true,
            adventure
        };
    }

    private validate (params: EditAdventureServiceParams): string | null {
        if (params.characterIds.length < MINIMUM_PLAYABLE_CHARACTERS) {
            return `You need at least ${MINIMUM_PLAYABLE_CHARACTERS} to edit an adventure`;
        }

        if (params.systemPromptIds.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            return 'A system prompt is required to edit an adventure';
        }

        return null;
    }

    private validateWithoutWorldMaster (params: EditAdventureServiceParams): string | null {
        if (params.characterIds.length < MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM) {
            return `Need at least ${MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM} characters to edit an adventure without a world master`;
        }

        if (!params.characterAsWorldMasterId) {
            return 'At least one character must be controlled by the AI when editing an adventure without a world master';
        }

        return null;
    }
}
