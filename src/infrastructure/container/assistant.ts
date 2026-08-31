import {
    CreateAssistantController,
    GetAssistantsController,
    EditAssistantController,
    EraseAssistantController,
} from '@adapters/controllers';
import { CreateAssistantService, EditAssistantService, GetSamplersService } from '@application/services';
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
    return new GetAssistantsController(logger, getAssistantsUseCase);
}

export function editAssistantController (): IEditAssistantController {
    const assistantRepository = createAssistantRepository(storage, logger);
    const editAssistantService = new EditAssistantService(logger);
    const getSamplersService = new GetSamplersService(logger);
    const editAssistantUseCase = new EditAssistantUseCase(
        logger,
        editAssistantService,
        assistantRepository,
        createSamplerRepository(storage, logger),
        getSamplersService,
        createConnectionRepository(storage, logger)
    );
    return new EditAssistantController(logger, editAssistantUseCase);
}

export function eraseAssistantController (): IEraseAssistantController {
    const assistantRepository = createAssistantRepository(storage, logger);
    const eraseAssistantUseCase = new EraseAssistantUseCase(logger, assistantRepository);
    return new EraseAssistantController(logger, eraseAssistantUseCase);
}
