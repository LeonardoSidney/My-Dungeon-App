import {
    CreateProficiencyController,
    GetProficienciesController,
    EditProficiencyController,
    EraseProficiencyController,
    GetProficiencyController,
} from '@adapters/controllers';
import {
    GetProficienciesPresenter,
    GetProficiencyPresenter,
} from '@adapters/presenters';
import { CreateProficiencyService, EditProficiencyService } from '@application/services';
import {
    CreateProficiencyUseCase,
    GetProficienciesUseCase,
    EditProficiencyUseCase,
    EraseProficiencyUseCase,
    GetProficiencyByIdUseCase,
} from '@application/use-cases';
import {
    ICreateProficiencyController,
    IGetProficienciesController,
    IEditProficiencyController,
    IEraseProficiencyController,
    IGetProficiencyController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createProficiencyRepository } from './repository';

export function createProficiencyController (): ICreateProficiencyController {
    const createProficiencyService = new CreateProficiencyService(logger, idGenerate);
    const proficiencyRepository = createProficiencyRepository(storage, logger);
    const createProficiencyUseCase = new CreateProficiencyUseCase(
        logger,
        createProficiencyService,
        proficiencyRepository
    );
    return new CreateProficiencyController(logger, createProficiencyUseCase);
}

export function getProficienciesController (): IGetProficienciesController {
    const proficiencyRepository = createProficiencyRepository(storage, logger);
    const getProficienciesUseCase = new GetProficienciesUseCase(logger, proficiencyRepository);
    return new GetProficienciesController(logger, getProficienciesUseCase, new GetProficienciesPresenter());
}

export function editProficiencyController (): IEditProficiencyController {
    const proficiencyRepository = createProficiencyRepository(storage, logger);
    const editProficiencyService = new EditProficiencyService(logger);
    const editProficiencyUseCase = new EditProficiencyUseCase(logger, editProficiencyService, proficiencyRepository);
    return new EditProficiencyController(logger, editProficiencyUseCase);
}

export function eraseProficiencyController (): IEraseProficiencyController {
    const proficiencyRepository = createProficiencyRepository(storage, logger);
    const eraseProficiencyUseCase = new EraseProficiencyUseCase(logger, proficiencyRepository);
    return new EraseProficiencyController(logger, eraseProficiencyUseCase);
}

export function getProficiencyController (): IGetProficiencyController {
    const useCase = new GetProficiencyByIdUseCase(logger, createProficiencyRepository(storage, logger));
    return new GetProficiencyController(logger, useCase, new GetProficiencyPresenter());
}
