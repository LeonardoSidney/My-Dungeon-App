import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { GetModelsFromProviderParamsReturn, GetModelsFromProviderParamsUseCase, IGetModelsFromProviderUseCase } from '@domain/use-cases';

export class GetModelsFromProviderUseCase implements IGetModelsFromProviderUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (params: GetModelsFromProviderParamsUseCase): Promise<GetModelsFromProviderParamsReturn> {
        this.logger.info('Executing GetModelsFromProviderUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const connectionResponse = await this.connectionRepository.getConnectionById(params.connectionId);
        if (!connectionResponse.success) {
            this.logger.warning('GetModelsFromProviderUseCase::execute - failed to load connection', connectionResponse.error);
            return { success: false, error: connectionResponse.error };
        }

        const connection = connectionResponse.connection;
        if (!connection) {
            return { success: false, error: `Connection not found: ${params.connectionId}` };
        }

        const response = await this.gateway.getModels(connection);
        if (!response.success) {
            this.logger.warning('GetModelsFromProviderUseCase::execute - failed to load models', response.error);
            return { success: false, error: response.error };
        }

        this.logger.debug('Gateway getModelsFromProvider executed successfully: ', response.models);
        return {
            success: true,
            models: response.models
        };
    }

    private validate (params: GetModelsFromProviderParamsUseCase): string | null {
        if (!params.connectionId?.trim()) {
            return 'Connection id is required';
        }

        return null;
    }
}
