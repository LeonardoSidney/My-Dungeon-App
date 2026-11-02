import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAdventureServiceParams, EditAdventureServiceReturn, IEditAdventureService } from '@domain/services';
import { buildAdventureCharacterIds } from '@application/shared/adventureCharacterRules';

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

        const editedAdventure: Adventure = {
            ...adventure,
            name: editParams.name.trim(),
            systemPromptIds: editParams.systemPromptIds,
            characterIds,
            worldMasterId: editParams.worldMasterId,
            characterAsWorldMasterId: editParams.characterAsWorldMasterId,
            charactersControlledByAi: editParams.aiControlledCharacterIds,
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
