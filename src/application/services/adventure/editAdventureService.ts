import { MINIMUM_NUMBER_SYSTEM_PROMPT, MINIMUM_PLAYABLE_CHARACTERS, MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM } from '@domain/constants/adventure';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { AdventureEditParams, EditAdventureServiceParams, EditAdventureServiceReturn, IEditAdventureService } from '@domain/services';

export class EditAdventureService implements IEditAdventureService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn {
        this.logger.info('Executing EditAdventureService::editAdventure');
        const { adventure, editParams } = params;
        const validationError = this.validate(editParams);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const withoutWorldMasterError = editParams.worldMasterId ? null : this.validateWithoutWorldMaster(editParams);
        if (withoutWorldMasterError) {
            return { success: false, error: withoutWorldMasterError };
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

    private validate (params: AdventureEditParams): string | null {
        if (params.characterIds.length < MINIMUM_PLAYABLE_CHARACTERS) {
            return `You need at least ${MINIMUM_PLAYABLE_CHARACTERS} to edit an adventure`;
        }

        if (params.systemPromptIds.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            return 'A system prompt is required to edit an adventure';
        }

        return null;
    }

    private validateWithoutWorldMaster (params: AdventureEditParams): string | null {
        if (params.characterIds.length < MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM) {
            return `Need at least ${MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM} characters to edit an adventure without a world master`;
        }

        if (!params.characterAsWorldMasterId) {
            return 'At least one character must be controlled by the AI when editing an adventure without a world master';
        }

        return null;
    }
}
