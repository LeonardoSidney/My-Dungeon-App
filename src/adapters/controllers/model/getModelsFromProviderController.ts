import { IGetModelsFromProviderController, GetModelsControllerRequest, GetModelsControllerResponse } from "../../../domain/controllers";
import { ILogger } from "../../../domain/logger";
import { IGetModelsFromProviderUseCase } from "../../../domain/use-cases";

export class GetModelsFromProviderController implements IGetModelsFromProviderController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetModelsFromProviderUseCase
    ) { }

    public async handle(request: GetModelsControllerRequest): Promise<GetModelsControllerResponse> {
        this.logger.info('Executing GetModelsFromProviderController::handle');
        const { connection } = request;
        const response = await this.useCase.execute({ connection });
        return {
            success: response.success,
            models: response.models,
            error: response.error
        };
    }
}
