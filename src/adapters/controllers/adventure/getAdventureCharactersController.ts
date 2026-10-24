import {
    GetAdventureCharactersControllerParams,
    GetAdventureCharactersControllerResponse,
    IGetAdventureCharactersController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventureCharactersPresenter } from '@domain/presenters';
import { IGetAdventureCharactersUseCase } from '@domain/use-cases';

export class GetAdventureCharactersController implements IGetAdventureCharactersController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureCharactersUseCase,
        private readonly presenter: IGetAdventureCharactersPresenter
    ) { }

    async handle (params: GetAdventureCharactersControllerParams): Promise<GetAdventureCharactersControllerResponse> {
        this.logger.info('Executing GetAdventureCharactersController::handle');
        this.logger.debug('GetAdventureCharactersController::handle - params', params);

        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            items: response.characters && this.presenter.present(response.characters),
            error: response.error,
        };
    }
}
