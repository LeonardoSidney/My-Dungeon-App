import {
    CreateCharacterController,
    GetCharactersController,
    EditCharacterController,
    EraseCharacterController,
    GetCharacterController,
} from '@adapters/controllers';
import {
    GetCharacterPresenter,
    GetCharactersPresenter,
} from '@adapters/presenters';
import { CreateCharacterService, EditCharacterService } from '@application/services';
import {
    CreateCharacterUseCase,
    GetCharactersUseCase,
    EditCharacterUseCase,
    EraseCharacterUseCase,
    GetCharacterByIdUseCase,
} from '@application/use-cases';
import {
    ICreateCharacterController,
    IGetCharactersController,
    IEditCharacterController,
    IEraseCharacterController,
    IGetCharacterController,
} from '@domain/controllers';
import { IEditCharacterUseCase, IGetCharacterByIdUseCase, IGetCharactersUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import {
    createAbilityRepository,
    createAssistantRepository,
    createCharacterRepository,
    createProficiencyRepository,
    createStatusRepository,
} from './repository';

export function createCharacterController (): ICreateCharacterController {
    const characterRepository = createCharacterRepository(storage, logger);
    const createCharacterService = new CreateCharacterService(logger, idGenerate);
    const createCharacterUseCase = new CreateCharacterUseCase(
        logger,
        characterRepository,
        createCharacterService,
        createAssistantRepository(storage, logger),
        createAbilityRepository(storage, logger),
        createProficiencyRepository(storage, logger),
        createStatusRepository(storage, logger)
    );
    return new CreateCharacterController(logger, createCharacterUseCase);
}

export function createGetCharactersUseCase (): IGetCharactersUseCase {
    const characterRepository = createCharacterRepository(storage, logger);
    return new GetCharactersUseCase(logger, characterRepository);
}

export function getCharactersController (): IGetCharactersController {
    const getCharactersUseCase = createGetCharactersUseCase();
    return new GetCharactersController(logger, getCharactersUseCase, new GetCharactersPresenter());
}

export function createEditCharacterUseCase (): IEditCharacterUseCase {
    const editCharacterService = new EditCharacterService(logger);
    const characterRepository = createCharacterRepository(storage, logger);
    const assistantRepository = createAssistantRepository(storage, logger);
    const abilityRepository = createAbilityRepository(storage, logger);
    const proficiencyRepository = createProficiencyRepository(storage, logger);
    const statusRepository = createStatusRepository(storage, logger);
    return new EditCharacterUseCase(
        logger,
        editCharacterService,
        characterRepository,
        assistantRepository,
        abilityRepository,
        proficiencyRepository,
        statusRepository
    );
}

export function editCharacterController (): IEditCharacterController {
    const editCharacterUseCase = createEditCharacterUseCase();
    return new EditCharacterController(logger, editCharacterUseCase);
}

export function eraseCharacterController (): IEraseCharacterController {
    const characterRepository = createCharacterRepository(storage, logger);
    const eraseCharacterUseCase = new EraseCharacterUseCase(logger, characterRepository);
    return new EraseCharacterController(logger, eraseCharacterUseCase);
}

export function createGetCharacterByIdUseCase (): IGetCharacterByIdUseCase {
    const characterRepository = createCharacterRepository(storage, logger);
    return new GetCharacterByIdUseCase(logger, characterRepository);
}

export function getCharacterController (): IGetCharacterController {
    const getCharacterByIdUseCase = createGetCharacterByIdUseCase();
    return new GetCharacterController(logger, getCharacterByIdUseCase, new GetCharacterPresenter());
}
