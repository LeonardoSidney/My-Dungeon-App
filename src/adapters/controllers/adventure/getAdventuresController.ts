import { IGetAdventuresController } from '@domain/controllers';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetAdventuresUseCase } from '@domain/use-cases';

export class GetAdventuresController implements IGetAdventuresController {
    constructor(
        private logger: ILogger,
        private useCase: IGetAdventuresUseCase
    ) { }

    async handle(): Promise<Adventure[]> {
        this.logger.info('Executing GetAdventuresController::handle');
        return this.useCase.execute();
    }
}
