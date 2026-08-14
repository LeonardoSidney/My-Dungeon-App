import {
    CreateProficiencyController,
    GetProficienciesController,
    EditProficiencyController,
    EraseProficiencyController,
} from '@adapters/controllers';
import { CreateProficiencyService, EditProficiencyService } from '@application/services';
import {
    CreateProficiencyUseCase,
    GetProficienciesUseCase,
    EditProficiencyUseCase,
    EraseProficiencyUseCase,
} from '../../application/use-cases';
import {
    ICreateProficiencyController,
    IGetProficienciesController,
    IEditProficiencyController,
    IEraseProficiencyController,
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
    return new GetProficienciesController(logger, getProficienciesUseCase);
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
