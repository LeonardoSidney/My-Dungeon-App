import { GetByIdControllerParams, GetAbilityControllerResponse, IGetAbilityController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAbilityPresenter } from '@domain/presenters';
import { IGetAbilityByIdUseCase } from '@domain/use-cases';

export class GetAbilityController implements IGetAbilityController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAbilityByIdUseCase,
        private readonly presenter: IGetAbilityPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetAbilityControllerResponse> {
        this.logger.info('Executing GetAbilityController::handle');
        this.logger.debug('GetAbilityController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.ability && this.presenter.present(response.ability),
            error: response.error,
        };
    }
}
