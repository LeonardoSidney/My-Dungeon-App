import { GetByIdControllerParams, GetWorldMasterControllerResponse, IGetWorldMasterController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetWorldMasterPresenter } from '@domain/presenters';
import { IGetWorldMasterByIdUseCase } from '@domain/use-cases';

export class GetWorldMasterController implements IGetWorldMasterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetWorldMasterByIdUseCase,
        private readonly presenter: IGetWorldMasterPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetWorldMasterControllerResponse> {
        this.logger.info('Executing GetWorldMasterController::handle');
        this.logger.debug('GetWorldMasterController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.worldMaster && this.presenter.present(response.worldMaster),
            error: response.error,
        };
    }
}
