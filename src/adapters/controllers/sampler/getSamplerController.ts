import { GetByIdControllerParams, GetSamplerControllerResponse, IGetSamplerController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetSamplerPresenter } from '@domain/presenters';
import { IGetSamplerByIdUseCase } from '@domain/use-cases';

export class GetSamplerController implements IGetSamplerController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetSamplerByIdUseCase,
        private readonly presenter: IGetSamplerPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetSamplerControllerResponse> {
        this.logger.info('Executing GetSamplerController::handle');
        this.logger.debug('GetSamplerController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.sampler && this.presenter.present(response.sampler),
            error: response.error,
        };
    }
}
