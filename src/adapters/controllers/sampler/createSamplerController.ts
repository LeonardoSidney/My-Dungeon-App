import { CreateSamplerControllerParams, CreateSamplerControllerResponse, ICreateSamplerController } from "../../../domain/controllers";
import { ILogger } from "../../../domain/logger";
import { ICreateSamplerUseCase } from "../../../domain/use-cases";

export class CreateSamplerController implements ICreateSamplerController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: ICreateSamplerUseCase
    ) { }
    public async handle(params: CreateSamplerControllerParams): Promise<CreateSamplerControllerResponse> {
        this.logger.info("Execute CreateSamplerController::handle");
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            sampler: response.sampler,
            error: response.error
        }
    }
}
