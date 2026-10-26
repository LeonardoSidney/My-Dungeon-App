import {
    CreateWorldMasterController,
    GetWorldMastersController,
    EditWorldMasterController,
    EraseWorldMasterController,
    GetWorldMasterController,
} from '@adapters/controllers';
import {
    GetWorldMasterPresenter,
    GetWorldMastersPresenter,
} from '@adapters/presenters';
import { CreateWorldMasterService, EditWorldMasterService } from '@application/services';
import {
    CreateWorldMasterUseCase,
    GetWorldMastersUseCase,
    EditWorldMasterUseCase,
    EraseWorldMasterUseCase,
    GetWorldMasterByIdUseCase,
} from '@application/use-cases';
import {
    ICreateWorldMasterController,
    IGetWorldMastersController,
    IEditWorldMasterController,
    IEraseWorldMasterController,
    IGetWorldMasterController,
} from '@domain/controllers';
import { IEditWorldMasterUseCase, IGetWorldMasterByIdUseCase, IGetWorldMastersUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import {
    createAssistantRepository,
    createWorldMasterRepository,
} from './repository';

export function createWorldMasterController (): ICreateWorldMasterController {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const createWorldMasterService = new CreateWorldMasterService(logger, idGenerate);
    const createWorldMasterUseCase = new CreateWorldMasterUseCase(
        logger,
        worldMasterRepository,
        createWorldMasterService,
        createAssistantRepository(storage, logger)
    );
    return new CreateWorldMasterController(logger, createWorldMasterUseCase);
}

export function createGetWorldMastersUseCase (): IGetWorldMastersUseCase {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    return new GetWorldMastersUseCase(logger, worldMasterRepository);
}

export function getWorldMastersController (): IGetWorldMastersController {
    const getWorldMastersUseCase = createGetWorldMastersUseCase();
    return new GetWorldMastersController(logger, getWorldMastersUseCase, new GetWorldMastersPresenter());
}

export function createEditWorldMasterUseCase (): IEditWorldMasterUseCase {
    const editWorldMasterService = new EditWorldMasterService(logger);
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const assistantRepository = createAssistantRepository(storage, logger);
    return new EditWorldMasterUseCase(
        logger,
        editWorldMasterService,
        worldMasterRepository,
        assistantRepository
    );
}

export function editWorldMasterController (): IEditWorldMasterController {
    const editWorldMasterUseCase = createEditWorldMasterUseCase();
    return new EditWorldMasterController(logger, editWorldMasterUseCase);
}

export function eraseWorldMasterController (): IEraseWorldMasterController {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const eraseWorldMasterUseCase = new EraseWorldMasterUseCase(logger, worldMasterRepository);
    return new EraseWorldMasterController(logger, eraseWorldMasterUseCase);
}

export function createGetWorldMasterByIdUseCase (): IGetWorldMasterByIdUseCase {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    return new GetWorldMasterByIdUseCase(logger, worldMasterRepository);
}

export function getWorldMasterController (): IGetWorldMasterController {
    const getWorldMasterByIdUseCase = createGetWorldMasterByIdUseCase();
    return new GetWorldMasterController(logger, getWorldMasterByIdUseCase, new GetWorldMasterPresenter());
}
