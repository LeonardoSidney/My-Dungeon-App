import {
    CreateItemController,
    GetItemsController,
    EditItemController,
    EraseItemController,
    GetItemController,
} from '@adapters/controllers';
import {
    GetItemPresenter,
    GetItemsPresenter,
} from '@adapters/presenters';
import { CreateItemService, EditItemService } from '@application/services';
import {
    CreateItemUseCase,
    GetItemsUseCase,
    EditItemUseCase,
    EraseItemUseCase,
    GetItemByIdUseCase,
} from '@application/use-cases';
import {
    ICreateItemController,
    IGetItemsController,
    IEditItemController,
    IEraseItemController,
    IGetItemController,
} from '@domain/controllers';
import { IGetItemsUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import { createItemRepository } from './repository';

export function createItemController (): ICreateItemController {
    const itemRepository = createItemRepository(storage, logger);
    const createItemService = new CreateItemService(logger, idGenerate);
    const createItemUseCase = new CreateItemUseCase(logger, itemRepository, createItemService);
    return new CreateItemController(logger, createItemUseCase);
}

export function createGetItemsUseCase (): IGetItemsUseCase {
    const itemRepository = createItemRepository(storage, logger);
    return new GetItemsUseCase(logger, itemRepository);
}

export function getItemsController (): IGetItemsController {
    const getItemsUseCase = createGetItemsUseCase();
    return new GetItemsController(logger, getItemsUseCase, new GetItemsPresenter());
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

export function getItemController (): IGetItemController {
    const useCase = new GetItemByIdUseCase(logger, createItemRepository(storage, logger));
    return new GetItemController(logger, useCase, new GetItemPresenter());
}
