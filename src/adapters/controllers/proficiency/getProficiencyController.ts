import { GetByIdControllerParams, GetProficiencyControllerResponse, IGetProficiencyController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetProficiencyPresenter } from '@domain/presenters';
import { IGetProficiencyByIdUseCase } from '@domain/use-cases';

export class GetProficiencyController implements IGetProficiencyController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetProficiencyByIdUseCase,
        private readonly presenter: IGetProficiencyPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetProficiencyControllerResponse> {
        this.logger.info('Executing GetProficiencyController::handle');
        this.logger.debug('GetProficiencyController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.proficiency && this.presenter.present(response.proficiency),
            error: response.error,
        };
    }
}
