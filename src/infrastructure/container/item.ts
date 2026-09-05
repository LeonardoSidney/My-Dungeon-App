import {
    CreateItemController,
    GetItemsController,
    EditItemController,
    EraseItemController,
} from '@adapters/controllers';
import { CreateItemService, EditItemService } from '@application/services';
import {
    CreateItemUseCase,
    GetItemsUseCase,
    EditItemUseCase,
    EraseItemUseCase,
} from '@application/use-cases';
import {
    ICreateItemController,
    IGetItemsController,
    IEditItemController,
    IEraseItemController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createItemRepository } from './repository';

export function createItemController (): ICreateItemController {
    const itemRepository = createItemRepository(storage, logger);
    const createItemService = new CreateItemService(logger, idGenerate);
    const createItemUseCase = new CreateItemUseCase(logger, itemRepository, createItemService);
    return new CreateItemController(logger, createItemUseCase);
}

export function getItemsController (): IGetItemsController {
    const itemRepository = createItemRepository(storage, logger);
    const getItemsUseCase = new GetItemsUseCase(logger, itemRepository);
    return new GetItemsController(logger, getItemsUseCase);
}

export function editItemController (): IEditItemController {
    const itemRepository = createItemRepository(storage, logger);
    const editItemService = new EditItemService(logger);
    const editItemUseCase = new EditItemUseCase(logger, editItemService, itemRepository);
    return new EditItemController(logger, editItemUseCase);
}

export function eraseItemController (): IEraseItemController {
    const itemRepository = createItemRepository(storage, logger);
    const eraseItemUseCase = new EraseItemUseCase(logger, itemRepository);
    return new EraseItemController(logger, eraseItemUseCase);
}
