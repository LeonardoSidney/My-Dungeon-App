import {
    CreateWorldMasterController,
    GetWorldMastersController,
    EditWorldMasterController,
    EraseWorldMasterController,
} from '@adapters/controllers';
import { CreateWorldMasterService, EditWorldMasterService } from '@application/services';
import {
    CreateWorldMasterUseCase,
    GetWorldMastersUseCase,
    EditWorldMasterUseCase,
    EraseWorldMasterUseCase,
} from '../../application/use-cases';
import {
    ICreateWorldMasterController,
    IGetWorldMastersController,
    IEditWorldMasterController,
    IEraseWorldMasterController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createWorldMasterRepository } from './repository';

export function createWorldMasterController (): ICreateWorldMasterController {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const createWorldMasterService = new CreateWorldMasterService(logger, idGenerate);
    const createWorldMasterUseCase = new CreateWorldMasterUseCase(
        logger,
        worldMasterRepository,
        createWorldMasterService
    );
    return new CreateWorldMasterController(logger, createWorldMasterUseCase);
}

export function getWorldMasterController (): IGetWorldMastersController {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const getWorldMasterUseCase = new GetWorldMastersUseCase(logger, worldMasterRepository);
    return new GetWorldMastersController(logger, getWorldMasterUseCase);
}

export function editWorldMasterController (): IEditWorldMasterController {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const editWorldMasterService = new EditWorldMasterService(logger);
    const editWorldMasterUseCase = new EditWorldMasterUseCase(logger, editWorldMasterService, worldMasterRepository);
    return new EditWorldMasterController(logger, editWorldMasterUseCase);
}

export function eraseWorldMasterController (): IEraseWorldMasterController {
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const eraseWorldMasterUseCase = new EraseWorldMasterUseCase(logger, worldMasterRepository);
    return new EraseWorldMasterController(logger, eraseWorldMasterUseCase);
}
