import { ILogger } from '@domain/logger';
import { EditCharacterServiceParams, EditCharacterServiceReturn, IEditCharacterService } from '@domain/services';

export class EditCharacterService implements IEditCharacterService {
    constructor (
        private readonly logger: ILogger,
    ) { }

    editCharacter (params: EditCharacterServiceParams): EditCharacterServiceReturn {
        this.logger.info('EditCharacterService::editCharacter');

        const { character } = params;
        const updatedAt = new Date();

        return {
            success: true,
            character: {
                ...character,
                updatedAt
            }
        };
    }
}
