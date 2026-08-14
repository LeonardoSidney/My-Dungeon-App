import { CreateLocationController, GetLocationsController } from '@adapters/controllers';
import { CreateLocationService } from '@application/services';
import { CreateLocationUseCase, GetLocationsUseCase } from '../../application/use-cases';
import { ICreateLocationController, IGetLocationsController } from '@domain/controllers';
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
