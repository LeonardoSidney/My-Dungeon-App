import { GetAssistantsControllerResponse, IGetAssistantsController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAssistantsPresenter } from '@domain/presenters';
import { IGetAssistantsUseCase } from '@domain/use-cases';

export class GetAssistantsController implements IGetAssistantsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAssistantsUseCase,
        private readonly presenter: IGetAssistantsPresenter
    ) { }

    async handle (): Promise<GetAssistantsControllerResponse> {
        this.logger.info('Executing GetAssistantsController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.assistants && this.presenter.present(response.assistants),
            error: response.error,
        };
    }
}
