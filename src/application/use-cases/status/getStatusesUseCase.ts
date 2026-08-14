
import { Status } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';
import { IGetStatusesUseCase } from '@domain/use-cases';

export class GetStatusesUseCase implements IGetStatusesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (): Promise<Status[]> {
        this.logger.info('Executing GetStatusesUseCase::execute');
        return this.statusRepository.getStatuses();
    }
}
