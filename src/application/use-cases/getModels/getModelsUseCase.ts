import { IModelProviderGateway } from "../../../domain/gateways";
import { ILogger } from "../../../domain/logger";
import { GetModelsParamsReturn, GetModelsParamsUseCase, IGetModelsUseCase } from "./iGetModelsUseCase";

export class GetModelsUseCase implements IGetModelsUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway
    ) { }

    public async execute(params: GetModelsParamsUseCase): Promise<GetModelsParamsReturn> {
        this.logger.info('Executing GetModelsUseCase::execute');
        const { connection } = params;
        const modelsDTO = await this.gateway.getModels(connection);
        this.logger.debug('Gateway getModels executed successfully: ', modelsDTO);
        return {
            success: true,
            models: modelsDTO?.toEntity(connection)
        };
    }
}
