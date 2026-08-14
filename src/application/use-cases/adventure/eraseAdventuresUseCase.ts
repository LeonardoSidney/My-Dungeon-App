import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IEraseAdventuresUseCase } from '@domain/use-cases';

export class EraseAdventuresUseCase implements IEraseAdventuresUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (): Promise<void> {
        this.logger.info('Executing EraseAdventuresUseCase::execute');
        await this.adventureRepository.eraseAdventures();
    }
}
