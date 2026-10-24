import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { GetConnectionsUseCaseReturn, IGetConnectionsUseCase } from '@domain/use-cases';

export class GetConnectionsUseCase implements IGetConnectionsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (): Promise<GetConnectionsUseCaseReturn> {
        this.logger.info('Executing GetConnectionsUseCase::execute');

        const response = await this.connectionRepository.getConnections();
        if (!response.success || !response.connections) {
            this.logger.warning('GetConnectionsUseCase::execute - failed to load connections', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, connections: response.connections };
    }
}
