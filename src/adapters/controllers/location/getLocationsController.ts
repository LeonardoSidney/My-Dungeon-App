import { GetLocationsControllerResponse, IGetLocationsController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetLocationsPresenter } from '@domain/presenters';
import { IGetLocationsUseCase } from '@domain/use-cases';

export class GetLocationsController implements IGetLocationsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetLocationsUseCase,
        private readonly presenter: IGetLocationsPresenter
    ) { }

    async handle (): Promise<GetLocationsControllerResponse> {
        this.logger.info('Executing GetLocationsController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.locations && this.presenter.present(response.locations),
            error: response.error,
        };
    }
}
