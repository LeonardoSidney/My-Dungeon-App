import { GetAbilitiesControllerResponse, IGetAbilitiesController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAbilitiesPresenter } from '@domain/presenters';
import { IGetAbilitiesUseCase } from '@domain/use-cases';

export class GetAbilitiesController implements IGetAbilitiesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAbilitiesUseCase,
        private readonly presenter: IGetAbilitiesPresenter
    ) { }

    async handle (): Promise<GetAbilitiesControllerResponse> {
        this.logger.info('Executing GetAbilitiesController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.abilities && this.presenter.present(response.abilities),
            error: response.error,
        };
    }
}
