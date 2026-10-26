import { GetHomeSummaryControllerResponse, IGetHomeSummaryController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetHomeSummaryPresenter } from '@domain/presenters';
import { IGetHomeSummaryUseCase } from '@domain/use-cases';

export class GetHomeSummaryController implements IGetHomeSummaryController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetHomeSummaryUseCase,
        private readonly presenter: IGetHomeSummaryPresenter
    ) { }

    async handle (): Promise<GetHomeSummaryControllerResponse> {
        this.logger.info('Executing GetHomeSummaryController::handle');
        const response = await this.useCase.execute();

        return {
            success: response.success,
            data: response.summary && this.presenter.present(response.summary),
            error: response.error,
        };
    }
}
