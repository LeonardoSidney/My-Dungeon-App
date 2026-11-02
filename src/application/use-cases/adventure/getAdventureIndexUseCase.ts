import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { GetAdventureIndexUseCaseReturn, IGetAdventureIndexUseCase } from '@domain/use-cases';

export class GetAdventureIndexUseCase implements IGetAdventureIndexUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (): Promise<GetAdventureIndexUseCaseReturn> {
        this.logger.info('Executing GetAdventureIndexUseCase::execute');

        const response = await this.adventureRepository.getAdventureIndex();
        if (!response.success || !response.entries) {
            this.logger.warning('GetAdventureIndexUseCase::execute - failed to load the index', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, entries: response.entries };
    }
}
