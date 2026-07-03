import { World } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import { IGetWorldsUseCase } from '@domain/use-cases';

export class GetWorldsUseCase implements IGetWorldsUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly worldRepository: IWorldRepository
    ) { }

    async execute(): Promise<World[]> {
        this.logger.info('Executing GetWorldsUseCase::execute');
        return this.worldRepository.getWorlds();
    }
}
