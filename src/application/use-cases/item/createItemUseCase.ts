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

        this.validate(params);

        const response = this.service.createItem(params);
        this.logger.debug('CreateItemService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.item) {
            throw new Error('Something went wrong when tried to create the item');
        }

        const items = await this.itemRepository.getItems();
        this.logger.debug('ItemRepository executed successfully', items);
        const alreadyExists = items.find((item) => item.name === response.item?.name);

        if (alreadyExists) {
            this.logger.warning(`Item with name ${response.item.name} already exists`);
            return {
                success: false,
                error: `Item with name ${response.item.name} already exists`
            };
        }

        await this.itemRepository.saveItem({ item: response.item });

        return {
            success: true,
            item: response.item
        };
    }

    private validate (params: CreateItemUseCaseParams): void {
        if (!params.name?.trim()) {
            throw new Error('Name is required to create an item');
        }

        if (!params.prompt?.trim()) {
            throw new Error('Prompt is required to create an item');
        }

        if (!params.activationWord?.trim()) {
            throw new Error('Activation word is required to create an item');
        }
    }
}
