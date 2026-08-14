import {
    CreateWorldController,
    GetWorldsController,
    EraseWorldController,
    EditWorldController,
} from '@adapters/controllers';
import { CreateWorldService, EditWorldService } from '@application/services';
import { CreateWorldUseCase, GetWorldsUseCase, EraseWorldUseCase, EditWorldUseCase } from '../../application/use-cases';
import {
    ICreateWorldController,
    IGetWorldsController,
    IEraseWorldController,
    IEditWorldController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createWorldRepository } from './repository';

export function createWorldController (): ICreateWorldController {
    const worldRepository = createWorldRepository(storage, logger);
    const createWorldService = new CreateWorldService(logger, idGenerate);
    const createWorldUseCase = new CreateWorldUseCase(logger, worldRepository, createWorldService);
    return new CreateWorldController(logger, createWorldUseCase);
}

export function getWorldsController (): IGetWorldsController {
    const worldRepository = createWorldRepository(storage, logger);
    const getWorldsUseCase = new GetWorldsUseCase(logger, worldRepository);
    return new GetWorldsController(logger, getWorldsUseCase);
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
