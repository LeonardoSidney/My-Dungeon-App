import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import {
    IListModelsUseCase,
    ListedModel,
    ListModelsUseCaseParams,
    ListModelsUseCaseReturn,
} from '@domain/use-cases';

export class ListModelsUseCase implements IListModelsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (params: ListModelsUseCaseParams = {}): Promise<ListModelsUseCaseReturn> {
        this.logger.info('Executing ListModelsUseCase::execute');
        const connectionsResponse = await this.connectionRepository.getConnections();
        if (!connectionsResponse.success || !connectionsResponse.connections) {
            this.logger.warning('ListModelsUseCase::execute - failed to load connections', connectionsResponse.error);
            return { success: false, error: connectionsResponse.error };
        }

        const connections = connectionsResponse.connections;
        const listed: ListedModel[] = [];

        for (const connection of connections) {
            const response = await this.gateway.getModels(connection);
            if (!response.success || !response.models) {
                this.logger.warning(`ListModelsUseCase::execute - failed to load models from connection ${connection.id}`, response.error);
                continue;
            }

            for (const model of response.models) {
                if (params.loadedOnly && model.loaded !== true) continue;
                listed.push({ model, connection });
            }
        }

        return { success: true, models: listed };
    }
}
