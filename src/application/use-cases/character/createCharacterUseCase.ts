import { ILogger } from '@domain/logger';
import {
    IAbilityRepository,
    IAssistantRepository,
    ICharacterRepository,
    IProficiencyRepository,
    IStatusRepository,
} from '@domain/repository';
import { ICreateCharacterService } from '@domain/services';
import { CreateCharacterUseCasePrams, CreateCharacterUseCaseResponse, ICreateCharacterUseCase } from '@domain/use-cases';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

export class CreateCharacterUseCase implements ICreateCharacterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository,
        private readonly service: ICreateCharacterService,
        private readonly assistantRepository: IAssistantRepository,
        private readonly abilityRepository: IAbilityRepository,
        private readonly proficiencyRepository: IProficiencyRepository,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (params: CreateCharacterUseCasePrams): Promise<CreateCharacterUseCaseResponse> {
        this.logger.info('Executing CreateCharacterUseCase::execute');
        this.logger.debug('CreateCharacterUseCase::execute - params:', params);

        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

        this.logger.debug('Calling CreateCharacterService', params);
        const response = this.service.createCharacter(params);
        this.logger.debug('CreateCharacterService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.character) {
            return {
                success: false,
                error: 'Something went wrong when tried to create the character'
            };
        }

        const charactersResponse = await this.characterRepository.getCharacters();
        if (!charactersResponse.success || !charactersResponse.characters) {
            this.logger.warning('CreateCharacterUseCase::execute - failed to load characters', charactersResponse.error);
            return { success: false, error: charactersResponse.error };
        }

        const characters = charactersResponse.characters;
        this.logger.debug('CharacterRepository executed successfully', characters);
        const alreadyExists = characters.find((c) => c.name === response.character?.name);

        if (alreadyExists) {
            this.logger.warning(`Character with name ${response.character.name} already exists`);
            return {
                success: false,
                error: `Character with name ${response.character.name} already exists`
            };
        }

        const saveResult = await this.characterRepository.saveCharacter({ character: response.character });
        if (!saveResult.success) {
            this.logger.warning('CreateCharacterUseCase::execute - failed to save character', saveResult.error);
            return { success: false, error: saveResult.error };
        }

        return {
            success: true,
            id: response.character.id
        };
    }

    validate (params: CreateCharacterUseCasePrams): string | null {
        if (!params.name?.trim()) {
            return 'Name is required to create a character';
        }

        if (!params.prompt?.trim()) {
            return 'Prompt is required to create a character';
        }

        if (!params.activationWord?.trim()) {
            return 'Activation word is required to create a character';
        }

        return null;
    }

    private async validateReferencedIds (params: CreateCharacterUseCasePrams): Promise<string | null> {
        const assistantError = await checkReferencedId(
            (id: string) => this.assistantRepository.getAssistantById(id),
            REFERENCED_ENTITIES.ASSISTANT,
            params.assistantId
        );
        if (assistantError) {
            return assistantError;
        }
        const abilityError = await checkReferencedIds(
            (id: string) => this.abilityRepository.getAbilityById(id),
            REFERENCED_ENTITIES.ABILITY,
            params.abilityIds ?? []
        );
        if (abilityError) {
            return abilityError;
        }
        const proficiencyError = await checkReferencedIds(
            (id: string) => this.proficiencyRepository.getProficiencyById(id),
            REFERENCED_ENTITIES.PROFICIENCY,
            params.proficiencyIds ?? []
        );
        if (proficiencyError) {
            return proficiencyError;
        }
        const statusError = await checkReferencedIds(
            (id: string) => this.statusRepository.getStatusById(id),
            REFERENCED_ENTITIES.STATUS,
            params.statusIds ?? []
        );
        if (statusError) {
            return statusError;
        }
        return null;
    }
}
