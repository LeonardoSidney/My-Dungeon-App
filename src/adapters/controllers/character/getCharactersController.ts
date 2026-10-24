import { GetCharactersControllerResponse, IGetCharactersController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetCharactersPresenter } from '@domain/presenters';
import { IGetCharactersUseCase } from '@domain/use-cases';

export class GetCharactersController implements IGetCharactersController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetCharactersUseCase,
        private readonly presenter: IGetCharactersPresenter
    ) { }

    async handle (): Promise<GetCharactersControllerResponse> {
        this.logger.info('Executing GetCharactersController::handle');

        const response = await this.useCase.execute();

        return {
            success: response.success,
            items: response.characters && this.presenter.present(response.characters),
            error: response.error,
        };
    }
}
