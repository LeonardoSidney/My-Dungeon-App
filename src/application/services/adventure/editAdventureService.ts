import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAdventureServiceParams, EditAdventureServiceReturn, IEditAdventureService } from '@domain/services';
import { buildAdventureCharacterIds, validateAdventureCharacterSelection } from '@application/shared/adventureCharacterRules';

export class EditAdventureService implements IEditAdventureService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn {
        this.logger.info('Executing EditAdventureService::editAdventure');
        const { adventure, editParams } = params;

        const characterIds = buildAdventureCharacterIds({
            playableCharacterIds: editParams.playableCharacterIds,
            characterAsWorldMasterId: editParams.characterAsWorldMasterId,
            charactersControlledByAi: editParams.aiControlledCharacterIds,
        });
        const roster = {
            characterIds,
            worldMasterId: editParams.worldMasterId,
            characterAsWorldMasterId: editParams.characterAsWorldMasterId,
            charactersControlledByAi: editParams.aiControlledCharacterIds,
        };

        const validationError = validateAdventureCharacterSelection(roster, editParams.systemPromptIds.length);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const editedAdventure: Adventure = {
            ...adventure,
            name: editParams.name,
            systemPromptIds: editParams.systemPromptIds,
            ...roster,
            worldIds: editParams.worldIds,
            locationIds: editParams.locationIds,
            itemIds: editParams.itemIds,
            updatedAt: new Date()
        };

        return {
            success: true,
            adventure: editedAdventure
        };
    }
}
