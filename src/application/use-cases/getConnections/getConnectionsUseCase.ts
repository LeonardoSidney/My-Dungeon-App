import { Connection } from "../../../domain/entities";
import { ILogger } from "../../../domain/logger";
import { IConnectionRepository } from "../../../infrastructure/repository";
import { IGetConnectionsUseCase } from "./iGetConnectionsUseCase";

export class GetConnectionsUseCase implements IGetConnectionsUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    public execute(): Promise<Connection[]> {
        this.logger.info('Executing GetConnectionsUseCase');
        return this.connectionRepository.getConnections();
    }
}
