import { IGetAssistantsController } from '@domain/controllers';
import { Assistant } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetAssistantsUseCase } from '@domain/use-cases';

export class GetAssistantsController implements IGetAssistantsController {
    constructor (
        private logger: ILogger,
        private useCase: IGetAssistantsUseCase
    ) { }

    async handle (): Promise<Assistant[]> {
        this.logger.info('Executing GetAssistantsController::handle');
        return this.useCase.execute();
    }
}
