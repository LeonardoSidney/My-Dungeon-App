import { Connection } from "../../../domain/entities";
import { ILogger } from "../../../domain/logger";
import { IGetConnectionsRepository } from "../../../infrastructure/repository";
import { IGetConnectionsUseCase } from "./iGetConnectionsUseCase";

export class GetConnectionsUseCase implements IGetConnectionsUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly repository: IGetConnectionsRepository
    ) { }

    public execute(): Promise<Connection[]> {
        this.logger.info('Executing GetConnectionsUseCase');
        return this.repository.getConnections();
    }
}
