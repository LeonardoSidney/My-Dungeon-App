import { GetByIdControllerParams, GetSystemPromptControllerResponse, IGetSystemPromptController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetSystemPromptPresenter } from '@domain/presenters';
import { IGetSystemPromptByIdUseCase } from '@domain/use-cases';

export class GetSystemPromptController implements IGetSystemPromptController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetSystemPromptByIdUseCase,
        private readonly presenter: IGetSystemPromptPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetSystemPromptControllerResponse> {
        this.logger.info('Executing GetSystemPromptController::handle');
        this.logger.debug('GetSystemPromptController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.systemPrompt && this.presenter.present(response.systemPrompt),
            error: response.error,
        };
    }
}
