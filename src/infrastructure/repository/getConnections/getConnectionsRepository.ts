import { CONNECTION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from "../../../domain/constants/general";
import { Connection } from "../../../domain/entities";
import { ILogger } from "../../../domain/logger";
import { IStorage } from "../../storage/iStorage";
import { IGetConnectionsRepository } from "./iGetConnectionsRepository";

export class GetConnectionsRepository implements IGetConnectionsRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) {}
    
    public async getConnections(): Promise<Connection[]> {
        this.logger.info("Executing GetConnectionsRepository");
        try {
            const connections = await this.storage.load<Connection[]>(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`);

            this.logger.debug("Executing GetConnectionsRepository with connections: ", connections);

            return connections || [];
        } catch (error) {
            this.logger.error("Error on GetConnectionsRepository", error);
            throw error;
        }
    }
}
