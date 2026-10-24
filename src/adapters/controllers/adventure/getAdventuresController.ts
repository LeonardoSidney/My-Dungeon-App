import { GetAdventuresControllerResponse, IGetAdventuresController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventuresPresenter } from '@domain/presenters';
import { IGetAdventuresUseCase } from '@domain/use-cases';

export class GetAdventuresController implements IGetAdventuresController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventuresUseCase,
        private readonly presenter: IGetAdventuresPresenter
    ) { }

    async handle (): Promise<GetAdventuresControllerResponse> {
        this.logger.info('Executing GetAdventuresController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.adventures && this.presenter.present(response.adventures),
            error: response.error,
        };
    }
}
