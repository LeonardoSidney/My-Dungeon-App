import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { EraseAdventureUseCaseReturn, IEraseAdventureUseCase } from '@domain/use-cases';

export class EraseAdventureUseCase implements IEraseAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (adventureId: string): Promise<EraseAdventureUseCaseReturn> {
        this.logger.info('Executing EraseAdventureUseCase::execute');
        this.logger.debug('Executing EraseAdventureUseCase::execute - adventureId: ', adventureId);

        const result = await this.adventureRepository.eraseAdventure(adventureId);

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
}
