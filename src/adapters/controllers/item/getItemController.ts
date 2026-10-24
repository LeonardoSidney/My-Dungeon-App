import { GetByIdControllerParams, GetItemControllerResponse, IGetItemController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetItemPresenter } from '@domain/presenters';
import { IGetItemByIdUseCase } from '@domain/use-cases';

export class GetItemController implements IGetItemController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetItemByIdUseCase,
        private readonly presenter: IGetItemPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetItemControllerResponse> {
        this.logger.info('Executing GetItemController::handle');
        this.logger.debug('GetItemController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.item && this.presenter.present(response.item),
            error: response.error,
        };
    }
}
