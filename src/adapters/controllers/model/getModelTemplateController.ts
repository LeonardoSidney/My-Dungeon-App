import { IGetModelTemplateController, GetModelTemplateControllerRequest, GetModelTemplateControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetModelTemplateUseCase } from '@domain/use-cases';

export class GetModelTemplateController implements IGetModelTemplateController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetModelTemplateUseCase
    ) { }

    async handle (request: GetModelTemplateControllerRequest): Promise<GetModelTemplateControllerResponse> {
        this.logger.info('Executing GetModelTemplateController::handle');
        const { connection, modelId } = request;
        const response = await this.useCase.execute({ connection, modelId });
        return {
            success: response.success,
            modelTemplate: response.modelTemplate,
            error: response.error
        };
    }
}
