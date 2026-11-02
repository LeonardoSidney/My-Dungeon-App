import { IMigrateAdventureStorageController, MigrateAdventureStorageControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IMigrateAdventureStorageUseCase } from '@domain/use-cases';

export class MigrateAdventureStorageController implements IMigrateAdventureStorageController {
    constructor (
        private logger: ILogger,
        private useCase: IMigrateAdventureStorageUseCase
    ) { }

    async handle (): Promise<MigrateAdventureStorageControllerResponse> {
        this.logger.info('Executing MigrateAdventureStorageController::handle');
        return this.useCase.execute();
    }
}
