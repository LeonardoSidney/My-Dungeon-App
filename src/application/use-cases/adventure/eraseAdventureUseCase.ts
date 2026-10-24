import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { EraseAdventureUseCaseReturn, IEraseAdventureUseCase, EraseAdventureUseCaseParams } from '@domain/use-cases';

export class EraseAdventureUseCase implements IEraseAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: EraseAdventureUseCaseParams): Promise<EraseAdventureUseCaseReturn> {
        this.logger.info('Executing EraseAdventureUseCase::execute');
        this.logger.debug('Executing EraseAdventureUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.adventureRepository.eraseAdventure(params.id);

        if (!result.success) {
            this.logger.warning('Failed to erase adventure', result);
            return {
                success: false,
                error: result.error || 'Failed to erase adventure'
            };
        }

        this.logger.info('Adventure erased successfully');
        return { success: true };
    }

    private validate (params: EraseAdventureUseCaseParams): string | null {
        if (!params.id) {
            return 'An adventure id is required to erase an adventure';
        }

        return null;
    }
}
