import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import { GetWorldsUseCaseReturn, IGetWorldsUseCase } from '@domain/use-cases';

export class GetWorldsUseCase implements IGetWorldsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldRepository: IWorldRepository
    ) { }

    async execute (): Promise<GetWorldsUseCaseReturn> {
        this.logger.info('Executing GetWorldsUseCase::execute');

        const response = await this.worldRepository.getWorlds();
        if (!response.success || !response.worlds) {
            this.logger.warning('GetWorldsUseCase::execute - failed to load worlds', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, worlds: response.worlds };
    }
}
