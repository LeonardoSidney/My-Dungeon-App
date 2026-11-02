import { GetAdventuresControllerResponse, IGetAdventuresController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventuresPresenter } from '@domain/presenters';
import { IGetAdventureIndexUseCase } from '@domain/use-cases';

export class GetAdventuresController implements IGetAdventuresController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureIndexUseCase,
        private readonly presenter: IGetAdventuresPresenter
    ) { }

    async handle (): Promise<GetAdventuresControllerResponse> {
        this.logger.info('Executing GetAdventuresController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.entries && this.presenter.present(response.entries),
            error: response.error,
        };
    }
}
