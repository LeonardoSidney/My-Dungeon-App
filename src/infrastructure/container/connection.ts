import {
    CreateConnectionConfigController,
    GetConnectionsController,
    EraseConnectionController,
    EditConnectionController,
} from '@adapters/controllers';
import { CreateConnectionConfigService, EditConnectionConfigService } from '@application/services';
import {
    CreateConnectionConfigUseCase,
    GetConnectionsUseCase,
    EraseConnectionUseCase,
    EditConnectionUseCase,
} from '@application/use-cases';
import {
    ICreateConnectionConfigController,
    IGetConnectionsController,
    IEraseConnectionController,
    IEditConnectionController,
} from '@domain/controllers';
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

export function getConnectionsController (): IGetConnectionsController {
    const connectionRepository = createConnectionRepository(storage, logger);
    const getConnectionsUseCase = new GetConnectionsUseCase(logger, connectionRepository);
    return new GetConnectionsController(logger, getConnectionsUseCase);
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
