import { GetByIdControllerParams, GetLocationControllerResponse, IGetLocationController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetLocationPresenter } from '@domain/presenters';
import { IGetLocationByIdUseCase } from '@domain/use-cases';

export class GetLocationController implements IGetLocationController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetLocationByIdUseCase,
        private readonly presenter: IGetLocationPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetLocationControllerResponse> {
        this.logger.info('Executing GetLocationController::handle');
        this.logger.debug('GetLocationController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.location && this.presenter.present(response.location),
            error: response.error,
        };
    }
}
