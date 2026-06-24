import { IGetModelsController, IGetModelsControllerRequest, IGetModelsControllerResponse } from "../../../domain/controllers";
import { ILogger } from "../../../domain/logger";
import { IGetModelsUseCase } from "../../../domain/use-cases";

export class GetModelsController implements IGetModelsController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetModelsUseCase
    ) {
    }

    public async handle(request: IGetModelsControllerRequest): Promise<IGetModelsControllerResponse> {
        this.logger.info('Executing GetModelsController::handle');
        const { connection } = request;
        const response = await this.useCase.execute({ connection });
        return {
            success: response.success,
            models: response.models,
            error: response.error
        };
    }
}
