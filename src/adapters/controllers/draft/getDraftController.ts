import { GetDraftControllerRequest, GetDraftControllerResponse, IGetDraftController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IDraftPresenter } from '@domain/presenters';
import { IGetDraftByIdUseCase } from '@domain/use-cases';

export class GetDraftController implements IGetDraftController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetDraftByIdUseCase,
        private readonly presenter: IDraftPresenter
    ) { }

    async handle (request: GetDraftControllerRequest): Promise<GetDraftControllerResponse> {
        this.logger.info('Executing GetDraftController::handle');
        this.logger.debug('GetDraftController::handle - params', request);

        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            draft: response.draft && this.presenter.present(response.draft),
            error: response.error,
        };
    }
}
