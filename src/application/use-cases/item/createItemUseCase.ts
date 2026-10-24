import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import { ICreateItemService } from '@domain/services';
import { CreateItemUseCaseParams, CreateItemUseCaseResponse, ICreateItemUseCase } from '@domain/use-cases';

export class CreateItemUseCase implements ICreateItemUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly itemRepository: IItemRepository,
        private readonly service: ICreateItemService
    ) { }

    async execute (params: CreateItemUseCaseParams): Promise<CreateItemUseCaseResponse> {
        this.logger.info('Executing CreateItemUseCase::execute');
        this.logger.debug('CreateItemUseCase::execute - params:', params);

        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const response = this.service.createItem(params);
        this.logger.debug('CreateItemService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.item) {
            return {
                success: false,
                error: 'Something went wrong when tried to create the item'
            };
        }

        const itemsResponse = await this.itemRepository.getItems();
        if (!itemsResponse.success || !itemsResponse.items) {
            this.logger.warning('CreateItemUseCase::execute - failed to load items', itemsResponse.error);
            return { success: false, error: itemsResponse.error };
        }

        const items = itemsResponse.items;
        this.logger.debug('ItemRepository executed successfully', items);
        const alreadyExists = items.find((item) => item.name === response.item?.name);

        if (alreadyExists) {
            this.logger.warning(`Item with name ${response.item.name} already exists`);
            return {
                success: false,
                error: `Item with name ${response.item.name} already exists`
            };
        }

        const saveResult = await this.itemRepository.saveItem({ item: response.item });
        if (!saveResult.success) {
            this.logger.warning('CreateItemUseCase::execute - failed to save item', saveResult.error);
            return { success: false, error: saveResult.error };
        }

        return {
            success: true,
            id: response.item.id
        };
    }

    private validate (params: CreateItemUseCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'Name is required to create an item';
        }

        if (!params.prompt?.trim()) {
            return 'Prompt is required to create an item';
        }

        if (!params.activationWord?.trim()) {
            return 'Activation word is required to create an item';
        }

        return null;
    }
}
