import {
    CreateConnectionConfigController,
    GetConnectionsController,
    EraseConnectionController,
    EditConnectionController,
    GetConnectionController,
} from '@adapters/controllers';
import {
    GetConnectionPresenter,
    GetConnectionsPresenter,
} from '@adapters/presenters';
import { CreateConnectionConfigService, EditConnectionConfigService } from '@application/services';
import {
    CreateConnectionConfigUseCase,
    GetConnectionsUseCase,
    EraseConnectionUseCase,
    EditConnectionUseCase,
    GetConnectionByIdUseCase,
} from '@application/use-cases';
import {
    ICreateConnectionConfigController,
    IGetConnectionsController,
    IEraseConnectionController,
    IEditConnectionController,
    IGetConnectionController,
} from '@domain/controllers';
import { IGetConnectionsUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import { createConnectionRepository } from './repository';

export function createConnectionConfigController (): ICreateConnectionConfigController {
    const createConnectionConfigService = new CreateConnectionConfigService(logger, idGenerate);
    const connectionRepository = createConnectionRepository(storage, logger);
    const createConnectionConfigUseCase = new CreateConnectionConfigUseCase(
        logger,
        createConnectionConfigService,
        connectionRepository
    );
    return new CreateConnectionConfigController(logger, createConnectionConfigUseCase);
}

export function createGetConnectionsUseCase (): IGetConnectionsUseCase {
    const connectionRepository = createConnectionRepository(storage, logger);
    return new GetConnectionsUseCase(logger, connectionRepository);
}

export function getConnectionsController (): IGetConnectionsController {
    const getConnectionsUseCase = createGetConnectionsUseCase();
    return new GetConnectionsController(logger, getConnectionsUseCase, new GetConnectionsPresenter());
}

export function eraseConnectionController (): IEraseConnectionController {
    const connectionRepository = createConnectionRepository(storage, logger);
    const eraseConnectionUseCase = new EraseConnectionUseCase(logger, connectionRepository);
    return new EraseConnectionController(logger, eraseConnectionUseCase);
}

export function editConnectionController (): IEditConnectionController {
    const editConnectionConfigService = new EditConnectionConfigService(logger);
    const connectionRepository = createConnectionRepository(storage, logger);
    const editConnectionUseCase = new EditConnectionUseCase(logger, editConnectionConfigService, connectionRepository);
    return new EditConnectionController(logger, editConnectionUseCase);
}

export function getConnectionController (): IGetConnectionController {
    const useCase = new GetConnectionByIdUseCase(logger, createConnectionRepository(storage, logger));
    return new GetConnectionController(logger, useCase, new GetConnectionPresenter());
}
