import { GetByIdControllerParams, GetConnectionControllerResponse, IGetConnectionController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetConnectionPresenter } from '@domain/presenters';
import { IGetConnectionByIdUseCase } from '@domain/use-cases';

export class GetConnectionController implements IGetConnectionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetConnectionByIdUseCase,
        private readonly presenter: IGetConnectionPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetConnectionControllerResponse> {
        this.logger.info('Executing GetConnectionController::handle');
        this.logger.debug('GetConnectionController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.connection && this.presenter.present(response.connection),
            error: response.error,
        };
    }
}
