import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditCharacterServiceParams, EditCharacterServiceReturn, IEditCharacterService } from '@domain/services';

export class EditCharacterService implements IEditCharacterService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editCharacter (params: EditCharacterServiceParams): EditCharacterServiceReturn {
        this.logger.info('Executing EditCharacterService::editCharacter');
        const { character, editParams } = params;

        const editedCharacter: Character = {
            ...character,
            name: editParams.name.trim(),
            activationWord: editParams.activationWord,
            prompt: editParams.prompt,
            observation: editParams.observation,
            abilityIds: editParams.abilityIds,
            proficiencyIds: editParams.proficiencyIds,
            statusIds: editParams.statusIds,
            attributes: editParams.attributes,
            assistantId: editParams.assistantId,
            updatedAt: new Date()
        };

        return {
            success: true,
            character: editedCharacter
        };
    }
}
