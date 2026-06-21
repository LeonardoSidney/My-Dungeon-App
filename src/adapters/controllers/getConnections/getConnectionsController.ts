import { IGetConnectionsUseCase } from "../../../application/use-cases";
import { Connection } from "../../../domain/entities";
import { ILogger } from "../../../domain/logger";
import { IGetConnectionsController } from "./IGetConnectionsController";

export class GetConnectionsController implements IGetConnectionsController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetConnectionsUseCase
    ) {}
    public handle(): Promise<Connection[]> {
        this.logger.info("Executing GetConnectionsController");
        return this.useCase.execute();
    }
}
