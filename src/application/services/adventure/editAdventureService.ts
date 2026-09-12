import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAdventureServiceParams, EditAdventureServiceReturn, IEditAdventureService } from '@domain/services';
import { validateAdventureCharacterSelection } from '@application/shared/adventureCharacterRules';

export class EditAdventureService implements IEditAdventureService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn {
        this.logger.info('Executing EditAdventureService::editAdventure');
        const { adventure, editParams } = params;
        const validationError = validateAdventureCharacterSelection(editParams, editParams.systemPromptIds.length);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const editedAdventure: Adventure = {
            ...adventure,
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            adventure: editedAdventure
        };
    }
}
