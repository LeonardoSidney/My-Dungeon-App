import { GetByIdControllerParams, GetWorldControllerResponse, IGetWorldController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetWorldPresenter } from '@domain/presenters';
import { IGetWorldByIdUseCase } from '@domain/use-cases';

export class GetWorldController implements IGetWorldController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetWorldByIdUseCase,
        private readonly presenter: IGetWorldPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetWorldControllerResponse> {
        this.logger.info('Executing GetWorldController::handle');
        this.logger.debug('GetWorldController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.world && this.presenter.present(response.world),
            error: response.error,
        };
    }
}
