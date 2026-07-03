import { IGetWorldMastersController } from '@domain/controllers';
import { WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetWorldMastersUseCase } from '@domain/use-cases';

export class GetWorldMastersController implements IGetWorldMastersController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetWorldMastersUseCase
    ) { }

    async handle(): Promise<WorldMaster[]> {
        this.logger.info('Executing GetWorldMastersController::handle');
        return this.useCase.execute();
    }
}
