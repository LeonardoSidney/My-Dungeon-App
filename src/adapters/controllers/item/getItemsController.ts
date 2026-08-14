import { IGetItemsController } from '@domain/controllers';
import { Item } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IGetItemsUseCase } from '@domain/use-cases';

export class GetItemsController implements IGetItemsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetItemsUseCase
    ) { }

    async handle (): Promise<Item[]> {
        this.logger.info('Executing GetItemsController::handle');
        return this.useCase.execute();
    }
}
