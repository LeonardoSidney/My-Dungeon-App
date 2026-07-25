import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';
import { EraseStatusUseCaseReturn, IEraseStatusUseCase } from '@domain/use-cases';

export class EraseStatusUseCase implements IEraseStatusUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (statusId: string): Promise<EraseStatusUseCaseReturn> {
        this.logger.info('Executing EraseStatusUseCase::execute');
        this.logger.debug('Executing EraseStatusUseCase::execute - statusId: ', statusId);

        const result = await this.statusRepository.eraseStatus(statusId);

        if (!result.success) {
            this.logger.warning('Failed to erase status', result);
            return {
                success: false,
                error: result.error || 'Failed to erase status'
            };
        }

        this.logger.info('Status erased successfully');
        return { success: true };
    }
}
