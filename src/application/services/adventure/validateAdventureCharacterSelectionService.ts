import { MINIMUM_PLAYABLE_CHARACTERS } from '@domain/constants/adventure';
import { ILogger } from '@domain/logger';
import {
    IValidateAdventureCharacterSelectionService,
    ValidateAdventureCharacterSelectionServiceParams,
    ValidateAdventureCharacterSelectionServiceReturn,
} from '@domain/services';
import { summarizeAdventureCharacters } from '@application/shared/adventureCharacterRules';

export class ValidateAdventureCharacterSelectionService implements IValidateAdventureCharacterSelectionService {
    constructor (private readonly logger: ILogger) { }

    validate (params: ValidateAdventureCharacterSelectionServiceParams): ValidateAdventureCharacterSelectionServiceReturn {
        this.logger.info('Executing ValidateAdventureCharacterSelectionService::validate');

        const error = this.findError(params);
        if (error) {
            this.logger.debug('ValidateAdventureCharacterSelectionService::validate - invalid selection', error);
            return { success: false, error };
        }

        return { success: true };
    }

    private findError (params: ValidateAdventureCharacterSelectionServiceParams): string | null {
        const { characterIds, worldMasterId, characterAsWorldMasterId, charactersControlledByAi } = params;

        if (worldMasterId && characterAsWorldMasterId) {
            return 'An adventure cannot have both a world master and a character acting as world master';
        }

        if (characterAsWorldMasterId && !characterIds.includes(characterAsWorldMasterId)) {
            return 'The character acting as world master must be part of the adventure';
        }

        const orphanedAiCharacter = charactersControlledByAi.find(id => !characterIds.includes(id));
        if (orphanedAiCharacter) {
            return 'Every AI controlled character must be part of the adventure';
        }

        if (characterAsWorldMasterId && charactersControlledByAi.includes(characterAsWorldMasterId)) {
            return 'The character acting as world master cannot be AI controlled';
        }

        const summary = summarizeAdventureCharacters(params);

        if (summary.playableCharacterCount < MINIMUM_PLAYABLE_CHARACTERS) {
            return `You need at least ${MINIMUM_PLAYABLE_CHARACTERS} playable character`;
        }

        if (!worldMasterId && !characterAsWorldMasterId) {
            return 'An adventure without a world master needs a character acting as world master';
        }

        return null;
    }
}
