import { GetStatusesControllerResponse, IGetStatusesController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetStatusesPresenter } from '@domain/presenters';
import { IGetStatusesUseCase } from '@domain/use-cases';

export class GetStatusesController implements IGetStatusesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetStatusesUseCase,
        private readonly presenter: IGetStatusesPresenter
    ) { }

    async handle (): Promise<GetStatusesControllerResponse> {
        this.logger.info('Executing GetStatusesController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.statuses && this.presenter.present(response.statuses),
            error: response.error,
        };
    }
}
