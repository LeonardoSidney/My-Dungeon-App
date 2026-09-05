import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import { EraseItemUseCaseReturn, IEraseItemUseCase } from '@domain/use-cases';

export class EraseItemUseCase implements IEraseItemUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly itemRepository: IItemRepository
    ) { }

    async execute (itemId: string): Promise<EraseItemUseCaseReturn> {
        this.logger.info('Executing EraseItemUseCase::execute');
        this.logger.debug('Executing EraseItemUseCase::execute - itemId: ', itemId);

        const result = await this.itemRepository.eraseItem(itemId);

        if (!result.success) {
            this.logger.warning('Failed to erase item', result);
            return {
                success: false,
                error: result.error || 'Failed to erase item'
            };
        }

        this.logger.info('Item erased successfully');
        return { success: true };
    }
}
