import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { EraseAdventuresUseCaseReturn, IEraseAdventuresUseCase } from '@domain/use-cases';

export class EraseAdventuresUseCase implements IEraseAdventuresUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (): Promise<EraseAdventuresUseCaseReturn> {
        this.logger.info('Executing EraseAdventuresUseCase::execute');

        const eraseResult = await this.adventureRepository.eraseAdventures();
        if (!eraseResult.success) {
            this.logger.warning('EraseAdventuresUseCase::execute - failed to erase adventures', eraseResult.error);
            return { success: false, error: eraseResult.error };
        }

        return { success: true };
    }
}
