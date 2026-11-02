import {
    GetAdventureMissingReferencesControllerParams,
    GetAdventureMissingReferencesControllerResponse,
    IGetAdventureMissingReferencesController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventureMissingReferencesPresenter } from '@domain/presenters';
import { IGetAdventureMissingReferencesUseCase } from '@domain/use-cases';

export class GetAdventureMissingReferencesController implements IGetAdventureMissingReferencesController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureMissingReferencesUseCase,
        private readonly presenter: IGetAdventureMissingReferencesPresenter
    ) { }

    async handle (params: GetAdventureMissingReferencesControllerParams): Promise<GetAdventureMissingReferencesControllerResponse> {
        this.logger.info('Executing GetAdventureMissingReferencesController::handle');
        this.logger.debug('GetAdventureMissingReferencesController::handle - params', params);

        const response = await this.useCase.execute(params);
        if (!response.success) {
            return { success: false, error: response.error };
        }

        return { success: true, issues: this.presenter.present(response.missingReferences ?? []) };
    }
}
