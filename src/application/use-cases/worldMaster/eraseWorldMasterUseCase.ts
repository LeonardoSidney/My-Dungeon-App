import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';
import { EraseWorldMasterUseCaseReturn, IEraseWorldMasterUseCase, EraseWorldMasterUseCaseParams } from '@domain/use-cases';

export class EraseWorldMasterUseCase implements IEraseWorldMasterUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (params: EraseWorldMasterUseCaseParams): Promise<EraseWorldMasterUseCaseReturn> {
        this.logger.info('Executing EraseWorldMasterUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.worldMasterRepository.eraseWorldMaster(params.id);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase world master' };
        }
        return { success: true };
    }

    private validate (params: EraseWorldMasterUseCaseParams): string | null {
        if (!params.id) {
            return 'A world master id is required to erase a world master';
        }

        return null;
    }
}
