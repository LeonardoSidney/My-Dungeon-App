import { GetConnectionsControllerResponse, IGetConnectionsController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetConnectionsPresenter } from '@domain/presenters';
import { IGetConnectionsUseCase } from '@domain/use-cases';

export class GetConnectionsController implements IGetConnectionsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetConnectionsUseCase,
        private readonly presenter: IGetConnectionsPresenter
    ) { }

    async handle (): Promise<GetConnectionsControllerResponse> {
        this.logger.info('Executing GetConnectionsController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.connections && this.presenter.present(response.connections),
            error: response.error,
        };
    }
}
