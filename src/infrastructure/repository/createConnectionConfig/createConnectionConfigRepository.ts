import { STORAGE_NAMESPACE } from "../../../domain/constants/general";
import { ILogger } from "../../../domain/logger";
import { IStorage } from "../../storage/iStorage";
import { CreateConnectionConfigRepositoryParams, ICreateConnectionConfigRepository } from "./iCreateConnectionConfigRepository";

export class CreateConnectionConfigRepository implements ICreateConnectionConfigRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }
    public async save(params: CreateConnectionConfigRepositoryParams): Promise<boolean> {
        this.logger.info("Executing CreateConnectionConfigRepository");
        this.logger.debug("Executing CreateConnectionConfigRepository with params: ", params);
        try {
            const { connection } = params;
            await this.storage.save(`${STORAGE_NAMESPACE}/connection`, connection);
        } catch (error) {
            this.logger.error("Error on CreateConnectionConfigRepository", error);
            throw error;
        }
        return true;
    }
}
