import {
    CreateAssistantController,
    GetAssistantsController,
    EditAssistantController,
    EraseAssistantController,
    GetAssistantController,
} from '@adapters/controllers';
import {
    GetAssistantPresenter,
    GetAssistantsPresenter,
} from '@adapters/presenters';
import { CreateAssistantService, EditAssistantService, GetSamplersService } from '@application/services';
import {
    CreateAssistantUseCase,
    GetAssistantsUseCase,
    EditAssistantUseCase,
    EraseAssistantUseCase,
    GetAssistantByIdUseCase,
} from '@application/use-cases';
import {
    ICreateAssistantController,
    IGetAssistantsController,
    IEditAssistantController,
    IEraseAssistantController,
    IGetAssistantController,
} from '@domain/controllers';
import { IEditAssistantUseCase, IGetAssistantByIdUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import {
    createAssistantRepository,
    createConnectionRepository,
    createSamplerRepository,
} from './repository';

export function createAssistantController (): ICreateAssistantController {
    const createAssistantService = new CreateAssistantService(logger, idGenerate);
    const getSamplersService = new GetSamplersService(logger);
    const assistantRepository = createAssistantRepository(storage, logger);
    const createAssistantUseCase = new CreateAssistantUseCase(
        logger,
        assistantRepository,
        createAssistantService,
        createSamplerRepository(storage, logger),
        getSamplersService,
        createConnectionRepository(storage, logger)
    );
    return new CreateAssistantController(logger, createAssistantUseCase);
}

export function getAssistantsController (): IGetAssistantsController {
    const assistantRepository = createAssistantRepository(storage, logger);
    const getAssistantsUseCase = new GetAssistantsUseCase(logger, assistantRepository);
    return new GetAssistantsController(logger, getAssistantsUseCase, new GetAssistantsPresenter());
}

export function createEditAssistantUseCase (): IEditAssistantUseCase {
    const editAssistantService = new EditAssistantService(logger);
    const assistantRepository = createAssistantRepository(storage, logger);
    const samplerRepository = createSamplerRepository(storage, logger);
    const getSamplersService = new GetSamplersService(logger);
    const connectionRepository = createConnectionRepository(storage, logger);
    return new EditAssistantUseCase(
        logger,
        editAssistantService,
        assistantRepository,
        samplerRepository,
        getSamplersService,
        connectionRepository
    );
}

export function editAssistantController (): IEditAssistantController {
    const editAssistantUseCase = createEditAssistantUseCase();
    return new EditAssistantController(logger, editAssistantUseCase);
}

export function eraseAssistantController (): IEraseAssistantController {
    const assistantRepository = createAssistantRepository(storage, logger);
    const eraseAssistantUseCase = new EraseAssistantUseCase(logger, assistantRepository);
    return new EraseAssistantController(logger, eraseAssistantUseCase);
}

export function createGetAssistantByIdUseCase (): IGetAssistantByIdUseCase {
    const assistantRepository = createAssistantRepository(storage, logger);
    return new GetAssistantByIdUseCase(logger, assistantRepository);
}

export function getAssistantController (): IGetAssistantController {
    const getAssistantByIdUseCase = createGetAssistantByIdUseCase();
    return new GetAssistantController(logger, getAssistantByIdUseCase, new GetAssistantPresenter());
}
