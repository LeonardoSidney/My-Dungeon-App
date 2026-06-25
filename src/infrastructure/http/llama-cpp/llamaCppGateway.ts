import { Connection } from "../../../domain/entities";
import { IModelProviderGateway } from "../../../domain/gateways";
import { ILogger } from "../../../domain/logger";
import { GetModelResponseDTO } from "./dto/getModelResponseDTO";

export class LlamaCppGateway implements IModelProviderGateway {
    constructor(
        private readonly logger: ILogger
    ) { }

    public async getModels(connection: Connection): Promise<GetModelResponseDTO | null> {
        this.logger.info("Executing LlamaCppGateway::getModels");
        const port = connection.port ? `:${connection.port}` : '';
        const ip = connection.ip.startsWith('http') ? connection.ip : `http://${connection.ip}`;
        const url = `${ip}${port}/models`;
        try {
            this.logger.debug("Executing LlamaCppGateway::getModels - url: ", url);
            const response = await fetch(url);
            this.logger.debug("Executing LlamaCppGateway::getModels - response: ", response);
            if (response.ok) {
                const data = await response.json();
                this.logger.debug("Executing LlamaCppGateway::getModels - data: ", data);
                if (data.models) {
                    return new GetModelResponseDTO(data.data, data.models);
                }
            }
        } catch (error) {
            throw new Error(`Error fetching models from ${url}: ${error}`);
        }

        return null;
    }
}
