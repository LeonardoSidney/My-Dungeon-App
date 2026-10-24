import { GetModelsListControllerResponse, IGetModelsController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetModelsPresenter } from '@domain/presenters';
import { IListModelsUseCase } from '@domain/use-cases';

export class GetModelsController implements IGetModelsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IListModelsUseCase,
        private readonly presenter: IGetModelsPresenter
    ) { }

    async handle (): Promise<GetModelsListControllerResponse> {
        this.logger.info('Executing GetModelsController::handle');
        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.models && this.presenter.present(response.models),
            error: response.error,
        };
    }
}
