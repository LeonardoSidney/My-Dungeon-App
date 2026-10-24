import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import {
    GetItemByIdUseCaseParams,
    GetItemByIdUseCaseReturn,
    IGetItemByIdUseCase,
} from '@domain/use-cases';

export class GetItemByIdUseCase implements IGetItemByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly itemRepository: IItemRepository
    ) { }

    async execute (params: GetItemByIdUseCaseParams): Promise<GetItemByIdUseCaseReturn> {
        this.logger.info('Executing GetItemByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const itemResponse = await this.itemRepository.getItemById(params.id);
        if (!itemResponse.success) {
            this.logger.warning('GetItemByIdUseCase::execute - failed to load item', itemResponse.error);
            return { success: false, error: itemResponse.error };
        }

        const item = itemResponse.item;
        if (!item) {
            return { success: false, error: `Item with id ${params.id} not found` };
        }

        return { success: true, item };
    }

    private validate (params: GetItemByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Item id is required';
        }

        return null;
    }
}
