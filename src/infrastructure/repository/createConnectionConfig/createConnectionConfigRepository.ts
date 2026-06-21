import { CONNECTION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../../domain/constants/general";
import { Connection } from "../../../domain/entities";
import { ILogger } from "../../../domain/logger";
import { IStorage } from "../../storage/iStorage";
import { CreateConnectionConfigRepositoryParams, ICreateConnectionConfigRepository } from "./iCreateConnectionConfigRepository";

export class CreateConnectionConfigRepository implements ICreateConnectionConfigRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    public async saveConnection(params: CreateConnectionConfigRepositoryParams): Promise<boolean> {
        this.logger.info("Executing CreateConnectionConfigRepository");
        this.logger.debug("Executing CreateConnectionConfigRepository with params: ", params);
        try {
            const { connection } = params;
            await this.storage.save(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`, connection);
        } catch (error) {
            this.logger.error("Error on CreateConnectionConfigRepository", error);
            throw error;
        }
        return true;
    }

    public async getConnections(): Promise<Connection[]> {
        this.logger.info("Executing CreateConnectionConfigRepository getConnections");
        try {
            const connections = await this.storage.load<Connection[]>(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`);
            this.logger.debug("Executing CreateConnectionConfigRepository getConnections with connections: ", connections);
            return connections || [];
        } catch (error) {
            this.logger.error("Error on CreateConnectionConfigRepository getConnections", error);
            throw error;
        }
    }
}
