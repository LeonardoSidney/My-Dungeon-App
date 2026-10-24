import { GetByIdControllerParams, GetAssistantControllerResponse, IGetAssistantController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAssistantPresenter } from '@domain/presenters';
import { IGetAssistantByIdUseCase } from '@domain/use-cases';

export class GetAssistantController implements IGetAssistantController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAssistantByIdUseCase,
        private readonly presenter: IGetAssistantPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetAssistantControllerResponse> {
        this.logger.info('Executing GetAssistantController::handle');
        this.logger.debug('GetAssistantController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.assistant && this.presenter.present(response.assistant),
            error: response.error,
        };
    }
}
