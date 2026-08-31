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
                character: undefined,
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
                character: undefined,
                error: 'Something went wrong when tried to create the character'
            };
        }

        const characters = await this.characterRepository.getCharacters();
        this.logger.debug('CharacterRepository executed successfully', characters);
        const alreadyExists = characters.find((c) => c.name === response.character?.name);

        if (alreadyExists) {
            this.logger.warning(`Character with name ${response.character.name} already exists`);
            return {
                success: false,
                error: `Character with name ${response.character.name} already exists`
            };
        }

        await this.characterRepository.saveCharacter({ character: response.character });

        return {
            success: true,
            character: response.character
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
            (id) => this.assistantRepository.getAssistantById(id),
            params.assistantId,
            'Assistant'
        );
        if (assistantError) {
            return assistantError;
        }
        const abilityError = await checkReferencedIds(
            (id) => this.abilityRepository.getAbilityById(id),
            params.abilityIds ?? [],
            'Ability'
        );
        if (abilityError) {
            return abilityError;
        }
        const proficiencyError = await checkReferencedIds(
            (id) => this.proficiencyRepository.getProficiencyById(id),
            params.proficiencyIds ?? [],
            'Proficiency'
        );
        if (proficiencyError) {
            return proficiencyError;
        }
        const statusError = await checkReferencedIds(
            (id) => this.statusRepository.getStatusById(id),
            params.statusIds ?? [],
            'Status'
        );
        if (statusError) {
            return statusError;
        }
        return null;
    }
}
