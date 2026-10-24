import { GetWorldMastersControllerResponse, IGetWorldMastersController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetWorldMastersPresenter } from '@domain/presenters';
import { IGetWorldMastersUseCase } from '@domain/use-cases';

export class GetWorldMastersController implements IGetWorldMastersController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetWorldMastersUseCase,
        private readonly presenter: IGetWorldMastersPresenter
    ) { }

    async handle (): Promise<GetWorldMastersControllerResponse> {
        this.logger.info('Executing GetWorldMastersController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.worldMasters && this.presenter.present(response.worldMasters),
            error: response.error,
        };
    }
}
