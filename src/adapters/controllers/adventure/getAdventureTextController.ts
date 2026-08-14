import { IGetAdventureTextController, GetAdventureTextControllerParams, GetAdventureTextControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventureTextUseCase } from '@domain/use-cases';

export class GetAdventureTextController implements IGetAdventureTextController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureTextUseCase
    ) { }

    async handle (params: GetAdventureTextControllerParams): Promise<GetAdventureTextControllerResponse> {
        this.logger.info('Executing GetAdventureTextController::handle');
        this.logger.debug('GetAdventureTextController::handle - params', params);

        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            prompt: response.prompt,
            error: response.error
        };
    }
}
