import {
    GetAdventureSummaryControllerParams,
    GetAdventureSummaryControllerResponse,
    IGetAdventureSummaryController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventureSummaryPresenter } from '@domain/presenters';
import { IGetAdventureByIdUseCase } from '@domain/use-cases';

export class GetAdventureSummaryController implements IGetAdventureSummaryController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureByIdUseCase,
        private readonly presenter: IGetAdventureSummaryPresenter
    ) { }

    async handle (params: GetAdventureSummaryControllerParams): Promise<GetAdventureSummaryControllerResponse> {
        this.logger.info('Executing GetAdventureSummaryController::handle');
        this.logger.debug('GetAdventureSummaryController::handle - params', params);

        const response = await this.useCase.execute({ id: params.adventureId });

        return {
            success: response.success,
            data: response.adventure && this.presenter.present(response.adventure),
            error: response.error,
        };
    }
}
