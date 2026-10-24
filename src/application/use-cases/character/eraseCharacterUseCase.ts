import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';
import { IEraseCharacterUseCase, EraseCharacterReturn, EraseCharacterUseCaseParams } from '@domain/use-cases';

export class EraseCharacterUseCase implements IEraseCharacterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository
    ) { }

    async execute (params: EraseCharacterUseCaseParams): Promise<EraseCharacterReturn> {
        this.logger.info('Executing EraseCharacterUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.characterRepository.eraseCharacter(params.id);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase character' };
        }
        return { success: true };
    }

    private validate (params: EraseCharacterUseCaseParams): string | null {
        if (!params.id) {
            return 'A character id is required to erase a character';
        }

        return null;
    }
}
