import { ILogger } from '@domain/logger';
import {
    IAbilityRepository,
    IAssistantRepository,
    ICharacterRepository,
    IProficiencyRepository,
    IStatusRepository,
} from '@domain/repository';
import { IEditCharacterService } from '@domain/services';
import { EditCharacterParams, EditCharacterReturn, IEditCharacterUseCase } from '@domain/use-cases';
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
                character: undefined,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params);
        if (missingIdError) {
            return {
                success: false,
                character: undefined,
                error: missingIdError
            };
        }

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

    private validate (params: EditCharacterParams): string | null {
        const { character } = params;

        if (!character.id) {
            return 'An id is required to edit a character';
        }

        if (!character.name?.trim()) {
            return 'A name is required to edit a character';
        }

        if (!character.activationWord?.trim()) {
            return 'An activation word is required to edit a character';
        }

        if (!character.prompt?.trim()) {
            return 'A prompt is required to edit a character';
        }

        return null;
    }

    private async validateReferencedIds (params: EditCharacterParams): Promise<string | null> {
        const { character } = params;
        const assistantError = await checkReferencedId(
            (id) => this.assistantRepository.getAssistantById(id),
            character.assistantId,
            'Assistant'
        );
        if (assistantError) {
            return assistantError;
        }
        const abilityError = await checkReferencedIds(
            (id) => this.abilityRepository.getAbilityById(id),
            character.abilityIds ?? [],
            'Ability'
        );
        if (abilityError) {
            return abilityError;
        }
        const proficiencyError = await checkReferencedIds(
            (id) => this.proficiencyRepository.getProficiencyById(id),
            character.proficiencyIds ?? [],
            'Proficiency'
        );
        if (proficiencyError) {
            return proficiencyError;
        }
        const statusError = await checkReferencedIds(
            (id) => this.statusRepository.getStatusById(id),
            character.statusIds ?? [],
            'Status'
        );
        if (statusError) {
            return statusError;
        }
        return null;
    }
}
