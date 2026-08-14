import {
    CreateCharacterController,
    GetCharactersController,
    EditCharacterController,
    EraseCharacterController,
} from '@adapters/controllers';
import { CreateCharacterService, EditCharacterService } from '@application/services';
import {
    CreateCharacterUseCase,
    GetCharactersUseCase,
    EditCharacterUseCase,
    EraseCharacterUseCase,
} from '../../application/use-cases';
import {
    ICreateCharacterController,
    IGetCharactersController,
    IEditCharacterController,
    IEraseCharacterController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createCharacterRepository } from './repository';

export function createCharacterController (): ICreateCharacterController {
    const characterRepository = createCharacterRepository(storage, logger);
    const createCharacterService = new CreateCharacterService(logger, idGenerate);
    const createCharacterUseCase = new CreateCharacterUseCase(logger, characterRepository, createCharacterService);
    return new CreateCharacterController(logger, createCharacterUseCase);
}

export function getCharactersController (): IGetCharactersController {
    const characterRepository = createCharacterRepository(storage, logger);
    const getCharactersUseCase = new GetCharactersUseCase(logger, characterRepository);
    return new GetCharactersController(logger, getCharactersUseCase);
}

export function editCharacterController (): IEditCharacterController {
    const characterRepository = createCharacterRepository(storage, logger);
    const editCharacterService = new EditCharacterService(logger);
    const editCharacterUseCase = new EditCharacterUseCase(logger, editCharacterService, characterRepository);
    return new EditCharacterController(logger, editCharacterUseCase);
}

export function eraseCharacterController (): IEraseCharacterController {
    const characterRepository = createCharacterRepository(storage, logger);
    const eraseCharacterUseCase = new EraseCharacterUseCase(logger, characterRepository);
    return new EraseCharacterController(logger, eraseCharacterUseCase);
}
