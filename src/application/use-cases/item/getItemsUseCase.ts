import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import { GetItemsUseCaseReturn, IGetItemsUseCase } from '@domain/use-cases';

export class GetItemsUseCase implements IGetItemsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly itemRepository: IItemRepository
    ) { }

    async execute (): Promise<GetItemsUseCaseReturn> {
        this.logger.info('Executing GetItemsUseCase::execute');

        const response = await this.itemRepository.getItems();
        if (!response.success || !response.items) {
            this.logger.warning('GetItemsUseCase::execute - failed to load items', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, items: response.items };
    }
}
