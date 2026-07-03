import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';
import { ICreateCharacterService } from '@domain/services';
import { CreateCharacterUseCasePrams, CreateCharacterUseCaseResponse, ICreateCharacterUseCase } from '@domain/use-cases';

export class CreateCharacterUseCase implements ICreateCharacterUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository,
        private readonly service: ICreateCharacterService
    ) { }

    async execute(params: CreateCharacterUseCasePrams): Promise<CreateCharacterUseCaseResponse> {
        this.logger.info('Executing CreateCharacterUseCase::execute');
        this.logger.debug('CreateCharacterUseCase::execute - params:', params);

        this.validate(params);

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
            throw new Error('Something went wrong when tried to create the character');
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

    validate(params: CreateCharacterUseCasePrams): void {
        if (!params.name?.trim()) {
            throw new Error('Name is required to create a character');
        }

        if (!params.prompt?.trim()) {
            throw new Error('Prompt is required to create a character');
        }

        if (!params.activationWord?.trim()) {
            throw new Error('Activation word is required to create a character');
        }
    }
}
