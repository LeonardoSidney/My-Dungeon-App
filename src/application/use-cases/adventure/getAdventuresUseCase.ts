import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IGetAdventuresUseCase } from '@domain/use-cases';

export class GetAdventureUseCase implements IGetAdventuresUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (): Promise<Adventure[]> {
        this.logger.info('Executing GetAdventureUseCase::execute');
        return this.adventureRepository.getAdventures();
    }
}
