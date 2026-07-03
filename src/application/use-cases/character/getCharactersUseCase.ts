import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';
import { IGetCharactersUseCase } from '@domain/use-cases';

export class GetCharactersUseCase implements IGetCharactersUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository
    ) { }

    async execute(): Promise<Character[]> {
        this.logger.info('Executing GetCharactersUseCase::execute');
        return this.characterRepository.getCharacters();
    }
}
