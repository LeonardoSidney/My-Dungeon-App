import { ILogger } from "../../logger";
import { IIdGenerator } from "../idGenerator";
import { CreateConnectionConfigServiceParams, CreateConnectionConfigServiceReturn, ICreateConnectionConfigService } from "./iCreateConnectionConfigService";

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
