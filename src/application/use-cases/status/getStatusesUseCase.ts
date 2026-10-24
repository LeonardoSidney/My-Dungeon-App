
import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';
import { GetStatusesUseCaseReturn, IGetStatusesUseCase } from '@domain/use-cases';

export class GetStatusesUseCase implements IGetStatusesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (): Promise<GetStatusesUseCaseReturn> {
        this.logger.info('Executing GetStatusesUseCase::execute');

        const response = await this.statusRepository.getStatuses();
        if (!response.success || !response.statuses) {
            this.logger.warning('GetStatusesUseCase::execute - failed to load statuses', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, statuses: response.statuses };
    }
}
