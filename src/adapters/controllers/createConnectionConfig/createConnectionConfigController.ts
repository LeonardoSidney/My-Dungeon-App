import { ICreateConnectionConfigUseCase } from "../../../application/use-cases";
import { ILogger } from "../../../domain/logger";
import { CreateConnectionConfigControllerRequest, CreateConnectionConfigControllerResponse, ICreateConnectionConfigController } from "./iCreateConnectionConfigController";

export class CreateConnectionConfigController implements ICreateConnectionConfigController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: ICreateConnectionConfigUseCase
    ) { }
    public async handle(request: CreateConnectionConfigControllerRequest): Promise<CreateConnectionConfigControllerResponse> {
        this.logger.info("Executing CreateConnectionConfigController");
        const { name, ip, port, auth } = request;
        const response = await this.useCase.execute({
            name,
            ip,
            port,
            auth
        });

        return {
            success: response.success,
            connection: response.connection
        };
    }
}
