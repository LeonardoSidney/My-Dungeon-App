import { GetSamplersControllerResponse, IGetSamplersController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetSamplersPresenter } from '@domain/presenters';
import { IGetSamplersUseCase } from '@domain/use-cases';

export class GetSamplersController implements IGetSamplersController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetSamplersUseCase,
        private readonly presenter: IGetSamplersPresenter
    ) { }

    async handle (): Promise<GetSamplersControllerResponse> {
        this.logger.info('Executing GetSamplersController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.samplers && this.presenter.present(response.samplers),
            error: response.error,
        };
    }
}
