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
            ...editParams,
            updatedAt: new Date()
        };

        return {
            success: true,
            character: editedCharacter
        };
    }
}
