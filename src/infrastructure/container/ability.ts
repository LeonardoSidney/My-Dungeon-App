import {
    CreateAbilityController,
    EditAbilityController,
    EraseAbilityController,
    GetAbilitiesController,
    GetAbilityController,
} from '@adapters/controllers';
import {
    GetAbilitiesPresenter,
    GetAbilityPresenter,
} from '@adapters/presenters';
import { CreateAbilityService, EditAbilityService } from '@application/services';
import {
    CreateAbilityUseCase,
    EditAbilityUseCase,
    EraseAbilityUseCase,
    GetAbilitiesUseCase,
    GetAbilityByIdUseCase,
} from '@application/use-cases';
import {
    ICreateAbilityController,
    IEditAbilityController,
    IEraseAbilityController,
    IGetAbilitiesController,
    IGetAbilityController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createAbilityRepository } from './repository';

export function createAbilityController (): ICreateAbilityController {
    const createAbilityService = new CreateAbilityService(logger, idGenerate);
    const abilityRepository = createAbilityRepository(storage, logger);
    const createAbilityUseCase = new CreateAbilityUseCase(logger, createAbilityService, abilityRepository);
    return new CreateAbilityController(logger, createAbilityUseCase);
}

export function getAbilitiesController (): IGetAbilitiesController {
    const abilityRepository = createAbilityRepository(storage, logger);
    const getAbilitiesUseCase = new GetAbilitiesUseCase(logger, abilityRepository);
    return new GetAbilitiesController(logger, getAbilitiesUseCase, new GetAbilitiesPresenter());
}

export function editAbilityController (): IEditAbilityController {
    const abilityRepository = createAbilityRepository(storage, logger);
    const editAbilityService = new EditAbilityService(logger);
    const editAbilityUseCase = new EditAbilityUseCase(logger, editAbilityService, abilityRepository);
    return new EditAbilityController(logger, editAbilityUseCase);
}

export function eraseAbilityController (): IEraseAbilityController {
    const abilityRepository = createAbilityRepository(storage, logger);
    const eraseAbilityUseCase = new EraseAbilityUseCase(logger, abilityRepository);
    return new EraseAbilityController(logger, eraseAbilityUseCase);
}

export function getAbilityController (): IGetAbilityController {
    const useCase = new GetAbilityByIdUseCase(logger, createAbilityRepository(storage, logger));
    return new GetAbilityController(logger, useCase, new GetAbilityPresenter());
}
