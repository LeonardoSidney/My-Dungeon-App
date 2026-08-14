import { Item } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import { IGetItemsUseCase } from '@domain/use-cases';

export class GetItemsUseCase implements IGetItemsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly itemRepository: IItemRepository
    ) { }

    async execute (): Promise<Item[]> {
        this.logger.info('Executing GetItemsUseCase::execute');
        return this.itemRepository.getItems();
    }
}
