import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';
import { GetCharactersUseCaseReturn, IGetCharactersUseCase } from '@domain/use-cases';

export class GetCharactersUseCase implements IGetCharactersUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository
    ) { }

    async execute (): Promise<GetCharactersUseCaseReturn> {
        this.logger.info('Executing GetCharactersUseCase::execute');

        const response = await this.characterRepository.getCharacters();
        if (!response.success || !response.characters) {
            this.logger.warning('GetCharactersUseCase::execute - failed to load characters', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, characters: response.characters };
    }
}
