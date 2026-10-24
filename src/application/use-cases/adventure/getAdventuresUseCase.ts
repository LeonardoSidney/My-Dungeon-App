import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { GetAdventuresUseCaseReturn, IGetAdventuresUseCase } from '@domain/use-cases';

export class GetAdventuresUseCase implements IGetAdventuresUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (): Promise<GetAdventuresUseCaseReturn> {
        this.logger.info('Executing GetAdventuresUseCase::execute');

        const response = await this.adventureRepository.getAdventures();
        if (!response.success || !response.adventures) {
            this.logger.warning('GetAdventuresUseCase::execute - failed to load adventures', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, adventures: response.adventures };
    }
}
