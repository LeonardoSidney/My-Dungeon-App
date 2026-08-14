import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { GetModelsFromProviderParamsReturn, GetModelsFromProviderParamsUseCase, IGetModelsFromProviderUseCase } from '@domain/use-cases';

export class GetModelsFromProviderUseCase implements IGetModelsFromProviderUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway
    ) { }

    async execute (params: GetModelsFromProviderParamsUseCase): Promise<GetModelsFromProviderParamsReturn> {
        this.logger.info('Executing GetModelsFromProviderUseCase::execute');
        const { connection } = params;
        const modelsDTO = await this.gateway.getModels(connection);
        this.logger.debug('Gateway getModelsFromProvider executed successfully: ', modelsDTO);
        return {
            success: true,
            models: modelsDTO?.toEntity(connection)
        };
    }
}
