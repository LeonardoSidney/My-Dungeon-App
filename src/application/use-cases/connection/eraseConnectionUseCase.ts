import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { IEraseConnectionUseCase, EraseConnectionUseCaseReturn } from '@domain/use-cases';

export class EraseConnectionUseCase implements IEraseConnectionUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute(connectionId: string): Promise<EraseConnectionUseCaseReturn> {
        this.logger.info('Executing EraseConnectionUseCase::execute');

        if (!connectionId) {
            return { success: false, error: 'A connection id is required to erase a connection' };
        }

        const result = await this.connectionRepository.eraseConnection(connectionId);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase connection' };
        }
        return { success: true };
    }
}
