import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';
import { GetWorldMastersUseCaseReturn, IGetWorldMastersUseCase } from '@domain/use-cases';

export class GetWorldMastersUseCase implements IGetWorldMastersUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (): Promise<GetWorldMastersUseCaseReturn> {
        this.logger.info('Executing GetWorldMastersUseCase::execute');

        const response = await this.worldMasterRepository.getWorldMasters();
        if (!response.success || !response.worldMasters) {
            this.logger.warning('GetWorldMastersUseCase::execute - failed to load world masters', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, worldMasters: response.worldMasters };
    }
}
