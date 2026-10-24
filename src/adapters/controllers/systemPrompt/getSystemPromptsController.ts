import { GetSystemPromptsControllerResponse, IGetSystemPromptsController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetSystemPromptsPresenter } from '@domain/presenters';
import { IGetSystemPromptsUseCase } from '@domain/use-cases';

export class GetSystemPromptsController implements IGetSystemPromptsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetSystemPromptsUseCase,
        private readonly presenter: IGetSystemPromptsPresenter
    ) { }

    async handle (): Promise<GetSystemPromptsControllerResponse> {
        this.logger.info('Executing GetSystemPromptsController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.systemPrompts && this.presenter.present(response.systemPrompts),
            error: response.error,
        };
    }
}
