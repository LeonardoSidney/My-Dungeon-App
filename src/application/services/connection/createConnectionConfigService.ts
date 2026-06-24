import { ILogger } from "../../../domain/logger";
import { CreateConnectionConfigServiceParams, CreateConnectionConfigServiceReturn, ICreateConnectionConfigService, IIdGenerator } from "../../../domain/services";

export class CreateConnectionConfigService implements ICreateConnectionConfigService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    public createConnectionConfig(params: CreateConnectionConfigServiceParams): CreateConnectionConfigServiceReturn {
        this.logger.info("Executing CreateConnectionConfigService");
        const { name, ip, port, auth } = params;
        const connection = {
            id: this.idGenerate.generate(),
            name,
            ip,
            port,
            auth,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return {
            success: true,
            connection
        };
    }
}
