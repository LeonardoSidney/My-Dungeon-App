import { IEraseAdventuresController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseAdventuresUseCase } from '@domain/use-cases';

export class EraseAdventuresController implements IEraseAdventuresController {
    constructor(
        private logger: ILogger,
        private useCase: IEraseAdventuresUseCase
    ) { }

    async handle(): Promise<void> {
        this.logger.info('Executing EraseAdventuresController::handle');
        await this.useCase.execute();
    }
}
