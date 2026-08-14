import {
    CreateAssistantController,
    GetAssistantsController,
    EditAssistantController,
    EraseAssistantController,
} from '@adapters/controllers';
import { CreateAssistantService, EditAssistantService } from '@application/services';
import {
    CreateAssistantUseCase,
    GetAssistantsUseCase,
    EditAssistantUseCase,
    EraseAssistantUseCase,
} from '../../application/use-cases';
import {
    ICreateAssistantController,
    IGetAssistantsController,
    IEditAssistantController,
    IEraseAssistantController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createAssistantRepository } from './repository';

export function createAssistantController (): ICreateAssistantController {
    const createAssistantService = new CreateAssistantService(logger, idGenerate);
    const assistantRepository = createAssistantRepository(storage, logger);
    const createAssistantUseCase = new CreateAssistantUseCase(logger, assistantRepository, createAssistantService);
    return new CreateAssistantController(logger, createAssistantUseCase);
}

export function getAssistantsController (): IGetAssistantsController {
    const assistantRepository = createAssistantRepository(storage, logger);
    const getAssistantsUseCase = new GetAssistantsUseCase(logger, assistantRepository);
    return new GetAssistantsController(logger, getAssistantsUseCase);
}

export function editAssistantController (): IEditAssistantController {
    const assistantRepository = createAssistantRepository(storage, logger);
    const editAssistantService = new EditAssistantService(logger);
    const editAssistantUseCase = new EditAssistantUseCase(logger, editAssistantService, assistantRepository);
    return new EditAssistantController(logger, editAssistantUseCase);
}

export function eraseAssistantController (): IEraseAssistantController {
    const assistantRepository = createAssistantRepository(storage, logger);
    const eraseAssistantUseCase = new EraseAssistantUseCase(logger, assistantRepository);
    return new EraseAssistantController(logger, eraseAssistantUseCase);
}
