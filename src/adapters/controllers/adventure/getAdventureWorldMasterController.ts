import {
    GetAdventureWorldMasterControllerParams,
    GetAdventureWorldMasterControllerResponse,
    IGetAdventureWorldMasterController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventureWorldMasterPresenter } from '@domain/presenters';
import { IGetAdventureWorldMasterUseCase } from '@domain/use-cases';

export class GetAdventureWorldMasterController implements IGetAdventureWorldMasterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureWorldMasterUseCase,
        private readonly presenter: IGetAdventureWorldMasterPresenter
    ) { }

    async handle (params: GetAdventureWorldMasterControllerParams): Promise<GetAdventureWorldMasterControllerResponse> {
        this.logger.info('Executing GetAdventureWorldMasterController::handle');
        this.logger.debug('GetAdventureWorldMasterController::handle - params', params);

        const response = await this.useCase.execute(params);
        if (!response.success) {
            return { success: false, error: response.error };
        }

        return {
            success: true,
            data: response.worldMaster ? this.presenter.present(response.worldMaster) : null,
        };
    }
}
