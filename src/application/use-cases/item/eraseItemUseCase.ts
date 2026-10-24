import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import { EraseItemUseCaseReturn, IEraseItemUseCase, EraseItemUseCaseParams } from '@domain/use-cases';

export class EraseItemUseCase implements IEraseItemUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly itemRepository: IItemRepository
    ) { }

    async execute (params: EraseItemUseCaseParams): Promise<EraseItemUseCaseReturn> {
        this.logger.info('Executing EraseItemUseCase::execute');
        this.logger.debug('Executing EraseItemUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.itemRepository.eraseItem(params.id);

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

    private validate (params: EraseItemUseCaseParams): string | null {
        if (!params.id) {
            return 'An item id is required to erase an item';
        }

        return null;
    }
}
