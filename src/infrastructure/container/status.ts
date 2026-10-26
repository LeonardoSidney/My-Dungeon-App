import {
    CreateStatusController,
    GetStatusesController,
    EditStatusController,
    EraseStatusController,
    GetStatusController,
} from '@adapters/controllers';
import {
    GetStatusPresenter,
    GetStatusesPresenter,
} from '@adapters/presenters';
import { CreateStatusService, EditStatusService } from '@application/services';
import {
    CreateStatusUseCase,
    GetStatusesUseCase,
    EditStatusUseCase,
    EraseStatusUseCase,
    GetStatusByIdUseCase,
} from '@application/use-cases';
import {
    ICreateStatusController,
    IGetStatusesController,
    IEditStatusController,
    IEraseStatusController,
    IGetStatusController,
} from '@domain/controllers';
import { IGetStatusesUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import { createStatusRepository } from './repository';

export function createStatusController (): ICreateStatusController {
    const createStatusService = new CreateStatusService(logger, idGenerate);
    const statusRepository = createStatusRepository(storage, logger);
    const createStatusUseCase = new CreateStatusUseCase(logger, createStatusService, statusRepository);
    return new CreateStatusController(logger, createStatusUseCase);
}

export function createGetStatusesUseCase (): IGetStatusesUseCase {
    const statusRepository = createStatusRepository(storage, logger);
    return new GetStatusesUseCase(logger, statusRepository);
}

export function getStatusesController (): IGetStatusesController {
    const getStatusesUseCase = createGetStatusesUseCase();
    return new GetStatusesController(logger, getStatusesUseCase, new GetStatusesPresenter());
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

export function getStatusController (): IGetStatusController {
    const useCase = new GetStatusByIdUseCase(logger, createStatusRepository(storage, logger));
    return new GetStatusController(logger, useCase, new GetStatusPresenter());
}
