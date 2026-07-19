import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';
import { EraseWorldMasterUseCaseReturn, IEraseWorldMasterUseCase } from '@domain/use-cases';

export class EraseWorldMasterUseCase implements IEraseWorldMasterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (worldMasterId: string): Promise<EraseWorldMasterUseCaseReturn> {
        this.logger.info('Executing EraseWorldMasterUseCase::execute');

        if (!worldMasterId) {
            return { success: false, error: 'A world master id is required to erase a world master' };
        }

        const result = await this.worldMasterRepository.eraseWorldMaster(worldMasterId);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase world master' };
        }
        return { success: true };
    }
}
