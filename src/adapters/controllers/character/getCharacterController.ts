import { GetByIdControllerParams, GetCharacterControllerResponse, IGetCharacterController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetCharacterPresenter } from '@domain/presenters';
import { IGetCharacterByIdUseCase } from '@domain/use-cases';

export class GetCharacterController implements IGetCharacterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetCharacterByIdUseCase,
        private readonly presenter: IGetCharacterPresenter
    ) { }

    async handle (params: GetByIdControllerParams): Promise<GetCharacterControllerResponse> {
        this.logger.info('Executing GetCharacterController::handle');
        this.logger.debug('GetCharacterController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            data: response.character && this.presenter.present(response.character),
            error: response.error,
        };
    }
}
