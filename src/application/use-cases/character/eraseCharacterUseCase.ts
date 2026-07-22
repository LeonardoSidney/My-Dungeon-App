import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';
import { IEraseCharacterUseCase, EraseCharacterReturn } from '@domain/use-cases';

export class EraseCharacterUseCase implements IEraseCharacterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository
    ) { }

    async execute (characterId: string): Promise<EraseCharacterReturn> {
        this.logger.info('Executing EraseCharacterUseCase::execute');

        if (!characterId) {
            return { success: false, error: 'A character id is required to erase a character' };
        }

        const result = await this.characterRepository.eraseCharacter(characterId);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase character' };
        }
        return { success: true };
    }
}
