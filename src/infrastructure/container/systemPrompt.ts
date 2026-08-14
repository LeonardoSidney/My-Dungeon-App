import {
    CreateSystemPromptController,
    GetSystemPromptsController,
    EditSystemPromptController,
    EraseSystemPromptController,
} from '@adapters/controllers';
import { CreateSystemPromptService, EditSystemPromptService } from '@application/services';
import {
    CreateSystemPromptUseCase,
    GetSystemPromptsUseCase,
    EditSystemPromptUseCase,
    EraseSystemPromptUseCase,
} from '../../application/use-cases';
import {
    ICreateSystemPromptController,
    IGetSystemPromptsController,
    IEditSystemPromptController,
    IEraseSystemPromptController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createSystemPromptRepository } from './repository';

export function createSystemPromptController (): ICreateSystemPromptController {
    const systemPromptRepository = createSystemPromptRepository(storage, logger);
    const createSystemPromptService = new CreateSystemPromptService(logger, idGenerate);
    const createSystemPromptUseCase = new CreateSystemPromptUseCase(
        logger,
        systemPromptRepository,
        createSystemPromptService
    );
    return new CreateSystemPromptController(logger, createSystemPromptUseCase);
}

export function getSystemPromptsController (): IGetSystemPromptsController {
    const systemPromptRepository = createSystemPromptRepository(storage, logger);
    const getSystemPromptsUseCase = new GetSystemPromptsUseCase(logger, systemPromptRepository);
    return new GetSystemPromptsController(logger, getSystemPromptsUseCase);
}

export function editSystemPromptController (): IEditSystemPromptController {
    const systemPromptRepository = createSystemPromptRepository(storage, logger);
    const editSystemPromptService = new EditSystemPromptService(logger);
    const editSystemPromptUseCase = new EditSystemPromptUseCase(
        logger,
        editSystemPromptService,
        systemPromptRepository
    );
    return new EditSystemPromptController(logger, editSystemPromptUseCase);
}

export function eraseSystemPromptController (): IEraseSystemPromptController {
    const systemPromptRepository = createSystemPromptRepository(storage, logger);
    const eraseSystemPromptUseCase = new EraseSystemPromptUseCase(logger, systemPromptRepository);
    return new EraseSystemPromptController(logger, eraseSystemPromptUseCase);
}
