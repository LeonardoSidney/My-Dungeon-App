import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IMigrateAdventureStorageUseCase, MigrateAdventureStorageUseCaseReturn } from '@domain/use-cases';

export class MigrateAdventureStorageUseCase implements IMigrateAdventureStorageUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (): Promise<MigrateAdventureStorageUseCaseReturn> {
        this.logger.info('Executing MigrateAdventureStorageUseCase::execute');

        const response = await this.adventureRepository.migrateLegacyStorage();
        if (!response.success) {
            this.logger.warning('MigrateAdventureStorageUseCase::execute - failed to migrate adventures', response.error);
            return { success: false, error: response.error };
        }

        return { success: true };
    }
}
