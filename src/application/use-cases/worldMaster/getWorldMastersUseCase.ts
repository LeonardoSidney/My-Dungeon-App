import { WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';
import { IGetWorldMastersUseCase } from '@domain/use-cases';

export class GetWorldMastersUseCase implements IGetWorldMastersUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (): Promise<WorldMaster[]> {
        this.logger.info('Executing GetWorldMastersUseCase::execute');
        return this.worldMasterRepository.getWorldMasters();
    }
}
