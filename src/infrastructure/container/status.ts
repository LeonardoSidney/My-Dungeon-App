import {
    CreateStatusController,
    GetStatusesController,
    EditStatusController,
    EraseStatusController,
} from '@adapters/controllers';
import { CreateStatusService, EditStatusService } from '@application/services';
import {
    CreateStatusUseCase,
    GetStatusesUseCase,
    EditStatusUseCase,
    EraseStatusUseCase,
} from '@application/use-cases';
import {
    ICreateStatusController,
    IGetStatusesController,
    IEditStatusController,
    IEraseStatusController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createStatusRepository } from './repository';

export function createStatusController (): ICreateStatusController {
    const createStatusService = new CreateStatusService(logger, idGenerate);
    const statusRepository = createStatusRepository(storage, logger);
    const createStatusUseCase = new CreateStatusUseCase(logger, createStatusService, statusRepository);
    return new CreateStatusController(logger, createStatusUseCase);
}

export function getStatusesController (): IGetStatusesController {
    const statusRepository = createStatusRepository(storage, logger);
    const getStatusesUseCase = new GetStatusesUseCase(logger, statusRepository);
    return new GetStatusesController(logger, getStatusesUseCase);
}

export function editStatusController (): IEditStatusController {
    const statusRepository = createStatusRepository(storage, logger);
    const editStatusService = new EditStatusService(logger);
    const editStatusUseCase = new EditStatusUseCase(logger, editStatusService, statusRepository);
    return new EditStatusController(logger, editStatusUseCase);
}

export function eraseStatusController (): IEraseStatusController {
    const statusRepository = createStatusRepository(storage, logger);
    const eraseStatusUseCase = new EraseStatusUseCase(logger, statusRepository);
    return new EraseStatusController(logger, eraseStatusUseCase);
}
