import { CreateItemController, GetItemsController } from '@adapters/controllers';
import { CreateItemService } from '@application/services';
import { CreateItemUseCase, GetItemsUseCase } from '../../application/use-cases';
import { ICreateItemController, IGetItemsController } from '@domain/controllers';
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
