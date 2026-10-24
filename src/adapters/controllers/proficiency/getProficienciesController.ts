import { GetProficienciesControllerResponse, IGetProficienciesController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetProficienciesPresenter } from '@domain/presenters';
import { IGetProficienciesUseCase } from '@domain/use-cases';

export class GetProficienciesController implements IGetProficienciesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetProficienciesUseCase,
        private readonly presenter: IGetProficienciesPresenter
    ) { }

    async handle (): Promise<GetProficienciesControllerResponse> {
        this.logger.info('Executing GetProficienciesController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.proficiencies && this.presenter.present(response.proficiencies),
            error: response.error,
        };
    }
}
