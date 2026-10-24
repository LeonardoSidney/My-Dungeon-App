import { IEraseAdventureController, EraseAdventureControllerResponse, EraseAdventureControllerRequest } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseAdventureUseCase, EraseAdventureUseCaseReturn } from '@domain/use-cases';

export class EraseAdventureController implements IEraseAdventureController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseAdventureUseCase
    ) { }

    async handle (request: EraseAdventureControllerRequest): Promise<EraseAdventureControllerResponse> {
        this.logger.info('Executing EraseAdventureController::handle');
        this.logger.debug('EraseAdventureController::handle - params', request);
        const result: EraseAdventureUseCaseReturn = await this.useCase.execute(request);
        return { success: result.success, error: result.error };
    }
}
