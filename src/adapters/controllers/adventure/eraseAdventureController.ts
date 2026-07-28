import { IEraseAdventureController, EraseAdventureControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseAdventureUseCase, EraseAdventureUseCaseReturn } from '@domain/use-cases';

export class EraseAdventureController implements IEraseAdventureController {
    constructor (
        private logger: ILogger,
        private useCase: IEraseAdventureUseCase
    ) { }

    async handle (adventureId: string): Promise<EraseAdventureControllerResponse> {
        this.logger.info('Executing EraseAdventureController::handle');
        const result: EraseAdventureUseCaseReturn = await this.useCase.execute(adventureId);
        return { success: result.success, error: result.error };
    }
}
