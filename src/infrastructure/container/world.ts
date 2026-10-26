import {
    CreateWorldController,
    GetWorldsController,
    EraseWorldController,
    EditWorldController,
    GetWorldController,
} from '@adapters/controllers';
import {
    GetWorldPresenter,
    GetWorldsPresenter,
} from '@adapters/presenters';
import { CreateWorldService, EditWorldService } from '@application/services';
import { CreateWorldUseCase, GetWorldsUseCase, EraseWorldUseCase, EditWorldUseCase, GetWorldByIdUseCase } from '@application/use-cases';
import {
    ICreateWorldController,
    IGetWorldsController,
    IEraseWorldController,
    IEditWorldController,
    IGetWorldController,
} from '@domain/controllers';
import { IGetWorldsUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import { createWorldRepository } from './repository';

export function createWorldController (): ICreateWorldController {
    const worldRepository = createWorldRepository(storage, logger);
    const createWorldService = new CreateWorldService(logger, idGenerate);
    const createWorldUseCase = new CreateWorldUseCase(logger, worldRepository, createWorldService);
    return new CreateWorldController(logger, createWorldUseCase);
}

export function createGetWorldsUseCase (): IGetWorldsUseCase {
    const worldRepository = createWorldRepository(storage, logger);
    return new GetWorldsUseCase(logger, worldRepository);
}

export function getWorldsController (): IGetWorldsController {
    const getWorldsUseCase = createGetWorldsUseCase();
    return new GetWorldsController(logger, getWorldsUseCase, new GetWorldsPresenter());
}

export function eraseWorldController (): IEraseWorldController {
    const worldRepository = createWorldRepository(storage, logger);
    const eraseWorldUseCase = new EraseWorldUseCase(logger, worldRepository);
    return new EraseWorldController(logger, eraseWorldUseCase);
}

export function editWorldController (): IEditWorldController {
    const editWorldService = new EditWorldService(logger);
    const worldRepository = createWorldRepository(storage, logger);
    const editWorldUseCase = new EditWorldUseCase(logger, editWorldService, worldRepository);
    return new EditWorldController(logger, editWorldUseCase);
}

export function getWorldController (): IGetWorldController {
    const useCase = new GetWorldByIdUseCase(logger, createWorldRepository(storage, logger));
    return new GetWorldController(logger, useCase, new GetWorldPresenter());
}
