import { GetWorldsControllerResponse, IGetWorldsController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetWorldsPresenter } from '@domain/presenters';
import { IGetWorldsUseCase } from '@domain/use-cases';

export class GetWorldsController implements IGetWorldsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetWorldsUseCase,
        private readonly presenter: IGetWorldsPresenter
    ) { }

    async handle (): Promise<GetWorldsControllerResponse> {
        this.logger.info('Executing GetWorldsController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.worlds && this.presenter.present(response.worlds),
            error: response.error,
        };
    }
}
