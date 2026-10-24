import { GetByIdControllerParams, GetStatusControllerResponse, IGetStatusController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetStatusPresenter } from '@domain/presenters';
import { IGetStatusByIdUseCase } from '@domain/use-cases';

export class GetStatusController implements IGetStatusController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetStatusByIdUseCase,
        private readonly presenter: IGetStatusPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetStatusControllerResponse> {
        this.logger.info('Executing GetStatusController::handle');
        this.logger.debug('GetStatusController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.status && this.presenter.present(response.status),
            error: response.error,
        };
    }
}
