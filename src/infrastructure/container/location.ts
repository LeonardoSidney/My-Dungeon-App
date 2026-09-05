import {
    CreateLocationController,
    GetLocationsController,
    EditLocationController,
    EraseLocationController,
} from '@adapters/controllers';
import { CreateLocationService, EditLocationService } from '@application/services';
import {
    CreateLocationUseCase,
    GetLocationsUseCase,
    EditLocationUseCase,
    EraseLocationUseCase,
} from '@application/use-cases';
import {
    ICreateLocationController,
    IGetLocationsController,
    IEditLocationController,
    IEraseLocationController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createLocationRepository } from './repository';

export function createLocationController (): ICreateLocationController {
    const locationRepository = createLocationRepository(storage, logger);
    const createLocationService = new CreateLocationService(logger, idGenerate);
    const createLocationUseCase = new CreateLocationUseCase(logger, locationRepository, createLocationService);
    return new CreateLocationController(logger, createLocationUseCase);
}

export function getLocationsController (): IGetLocationsController {
    const locationRepository = createLocationRepository(storage, logger);
    const getLocationsUseCase = new GetLocationsUseCase(logger, locationRepository);
    return new GetLocationsController(logger, getLocationsUseCase);
}

export function editLocationController (): IEditLocationController {
    const locationRepository = createLocationRepository(storage, logger);
    const editLocationService = new EditLocationService(logger);
    const editLocationUseCase = new EditLocationUseCase(logger, editLocationService, locationRepository);
    return new EditLocationController(logger, editLocationUseCase);
}

export function eraseLocationController (): IEraseLocationController {
    const locationRepository = createLocationRepository(storage, logger);
    const eraseLocationUseCase = new EraseLocationUseCase(logger, locationRepository);
    return new EraseLocationController(logger, eraseLocationUseCase);
}
