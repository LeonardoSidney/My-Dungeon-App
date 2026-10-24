import {
    GetAdventureControllerParams,
    GetAdventureControllerResponse,
    IGetAdventureController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventurePresenter } from '@domain/presenters';
import { IGetAdventureByIdUseCase } from '@domain/use-cases';

export class GetAdventureController implements IGetAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureByIdUseCase,
        private readonly presenter: IGetAdventurePresenter
    ) { }

    async handle (params: GetAdventureControllerParams): Promise<GetAdventureControllerResponse> {
        this.logger.info('Executing GetAdventureController::handle');
        this.logger.debug('GetAdventureController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.adventure && this.presenter.present(response.adventure),
            error: response.error,
        };
    }
}
