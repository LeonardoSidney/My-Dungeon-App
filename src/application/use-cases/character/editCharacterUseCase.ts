import { ILogger } from '@domain/logger';
import {
    IAbilityRepository,
    IAssistantRepository,
    ICharacterRepository,
    IProficiencyRepository,
    IStatusRepository,
} from '@domain/repository';
import { CharacterEditParams, IEditCharacterService } from '@domain/services';
import { EditCharacterParams, EditCharacterReturn, IEditCharacterUseCase } from '@domain/use-cases';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

export class EditCharacterUseCase implements IEditCharacterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditCharacterService,
        private readonly characterRepository: ICharacterRepository,
        private readonly assistantRepository: IAssistantRepository,
        private readonly abilityRepository: IAbilityRepository,
        private readonly proficiencyRepository: IProficiencyRepository,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (params: EditCharacterParams): Promise<EditCharacterReturn> {
        this.logger.info('Executing EditCharacterUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params.editParams);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

        const { id, editParams } = params;
        const characterResponse = await this.characterRepository.getCharacterById(id);
        if (!characterResponse.success) {
            this.logger.warning('EditCharacterUseCase::execute - failed to load character', characterResponse.error);
            return { success: false, error: characterResponse.error };
        }

        const character = characterResponse.character;
        if (!character) {
            return {
                success: false,
                error: `Character with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditCharacterService', { id, editParams });
        const response = this.service.editCharacter({ character, editParams });
        this.logger.debug('EditCharacterService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditCharacterService'
            };
        }

        if (!response.character) {
            return {
                success: false,
                error: 'Success is true but does not have a character'
            };
        }

        const editedCharacter = response.character;
        const existingCharactersResponse = await this.characterRepository.getCharacters();
        if (!existingCharactersResponse.success || !existingCharactersResponse.characters) {
            this.logger.warning('EditCharacterUseCase::execute - failed to load characters', existingCharactersResponse.error);
            return { success: false, error: existingCharactersResponse.error };
        }

        const existingCharacters = existingCharactersResponse.characters;
        const duplicateCharacter = existingCharacters.find(
            (c) => c.name === editedCharacter.name && c.id !== editedCharacter.id
        );

        if (duplicateCharacter) {
            this.logger.warning(`Character with name ${editedCharacter.name} already exists`);
            return {
                success: false,
                error: `Character with name ${editedCharacter.name} already exists`
            };
        }

        const editResult = await this.characterRepository.editCharacter({ character: editedCharacter });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit character'
            };
        }

        return {
            id: editedCharacter.id,
            success: true
        };
    }

    private validate (params: EditCharacterParams): string | null {
        if (!params.id?.trim()) {
            return 'An id is required to edit a character';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a character';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation word is required to edit a character';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit a character';
        }

        return null;
    }

    private async validateReferencedIds (editParams: CharacterEditParams): Promise<string | null> {
        const assistantError = await checkReferencedId(
            (id: string) => this.assistantRepository.getAssistantById(id),
            REFERENCED_ENTITIES.ASSISTANT,
            editParams.assistantId
        );
        if (assistantError) {
            return assistantError;
        }
        const abilityError = await checkReferencedIds(
            (id: string) => this.abilityRepository.getAbilityById(id),
            REFERENCED_ENTITIES.ABILITY,
            editParams.abilityIds ?? []
        );
        if (abilityError) {
            return abilityError;
        }
        const proficiencyError = await checkReferencedIds(
            (id: string) => this.proficiencyRepository.getProficiencyById(id),
            REFERENCED_ENTITIES.PROFICIENCY,
            editParams.proficiencyIds ?? []
        );
        if (proficiencyError) {
            return proficiencyError;
        }
        const statusError = await checkReferencedIds(
            (id: string) => this.statusRepository.getStatusById(id),
            REFERENCED_ENTITIES.STATUS,
            editParams.statusIds ?? []
        );
        if (statusError) {
            return statusError;
        }
        return null;
    }
}
