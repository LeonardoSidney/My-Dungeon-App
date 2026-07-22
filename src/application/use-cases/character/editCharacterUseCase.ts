import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';
import { IEditCharacterService } from '@domain/services';
import { EditCharacterParams, EditCharacterReturn, IEditCharacterUseCase } from '@domain/use-cases';

export class EditCharacterUseCase implements IEditCharacterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditCharacterService,
        private readonly characterRepository: ICharacterRepository
    ) { }

    async execute (params: EditCharacterParams): Promise<EditCharacterReturn> {
        this.logger.info('Executing EditCharacterUseCase::execute');
        this.validate(params);

        const { character } = params;

        this.logger.debug('Calling EditCharacterService', character);
        const response = this.service.editCharacter({ character });
        this.logger.debug('EditCharacterService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                character: undefined,
                error: response.error || 'An unknown error occurred on EditCharacterService'
            };
        }

        if (!response.character) {
            return {
                success: false,
                character: undefined,
                error: 'Success is true but does not have a character'
            };
        }

        const editedCharacter = response.character;
        const existingCharacters = await this.characterRepository.getCharacters();
        const duplicateCharacter = existingCharacters.find(
            (c) => c.name === editedCharacter.name && c.id !== editedCharacter.id
        );

        if (duplicateCharacter) {
            this.logger.warning(`Character with name ${editedCharacter.name} already exists`);
            return {
                success: false,
                character: undefined,
                error: `Character with name ${editedCharacter.name} already exists`
            };
        }

        const editResult = await this.characterRepository.editCharacter({ character: editedCharacter });
        if (!editResult.success) {
            return {
                success: false,
                character: undefined,
                error: editResult.error || 'Failed to edit character'
            };
        }

        return {
            character: editedCharacter,
            success: true
        };
    }

    private validate (params: EditCharacterParams): void {
        const { character } = params;

        if (!character.id) {
            throw new Error('An id is required to edit a character');
        }

        if (!character.name?.trim()) {
            throw new Error('A name is required to edit a character');
        }

        if (!character.activationWord?.trim()) {
            throw new Error('An activation word is required to edit a character');
        }

        if (!character.prompt?.trim()) {
            throw new Error('A prompt is required to edit a character');
        }
    }
}
