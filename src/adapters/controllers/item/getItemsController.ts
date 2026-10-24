import { GetItemsControllerResponse, IGetItemsController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetItemsPresenter } from '@domain/presenters';
import { IGetItemsUseCase } from '@domain/use-cases';

export class GetItemsController implements IGetItemsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetItemsUseCase,
        private readonly presenter: IGetItemsPresenter
    ) { }

    async handle (): Promise<GetItemsControllerResponse> {
        this.logger.info('Executing GetItemsController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.items && this.presenter.present(response.items),
            error: response.error,
        };
    }
}
