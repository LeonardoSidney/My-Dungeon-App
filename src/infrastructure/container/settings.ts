import {
    GetChatTemplatesController,
    GetSystemPromptLoadOrderController,
    GetThinkBlocksVisibilityController,
    ResetSystemPromptLoadOrderController,
    SaveChatTemplatesController,
    SaveSystemPromptLoadOrderController,
    SaveThinkBlocksVisibilityController,
} from '@adapters/controllers';
import { ValidateChatTemplatesService, ValidateSystemPromptLoadOrderService } from '@application/services';
import {
    GetChatTemplatesUseCase,
    GetSystemPromptLoadOrderUseCase,
    GetThinkBlocksVisibilityUseCase,
    ResetSystemPromptLoadOrderUseCase,
    SaveChatTemplatesUseCase,
    SaveSystemPromptLoadOrderUseCase,
    SaveThinkBlocksVisibilityUseCase,
} from '@application/use-cases';
import {
    IGetChatTemplatesController,
    IGetSystemPromptLoadOrderController,
    IGetThinkBlocksVisibilityController,
    IResetSystemPromptLoadOrderController,
    ISaveChatTemplatesController,
    ISaveSystemPromptLoadOrderController,
    ISaveThinkBlocksVisibilityController,
} from '@domain/controllers';
import { IGetChatTemplatesUseCase, IGetSystemPromptLoadOrderUseCase } from '@domain/use-cases';
import { logger, storage } from './shared';
import { createSettingsRepository } from './repository';

export function createGetSystemPromptLoadOrderUseCase (): IGetSystemPromptLoadOrderUseCase {
    return new GetSystemPromptLoadOrderUseCase(logger, createSettingsRepository(storage, logger));
}

export function getSystemPromptLoadOrderController (): IGetSystemPromptLoadOrderController {
    return new GetSystemPromptLoadOrderController(logger, createGetSystemPromptLoadOrderUseCase());
}

export function saveSystemPromptLoadOrderController (): ISaveSystemPromptLoadOrderController {
    const useCase = new SaveSystemPromptLoadOrderUseCase(
        logger,
        createSettingsRepository(storage, logger),
        new ValidateSystemPromptLoadOrderService(logger)
    );
    return new SaveSystemPromptLoadOrderController(logger, useCase);
}

export function resetSystemPromptLoadOrderController (): IResetSystemPromptLoadOrderController {
    const useCase = new ResetSystemPromptLoadOrderUseCase(logger, createSettingsRepository(storage, logger));
    return new ResetSystemPromptLoadOrderController(logger, useCase);
}

export function getThinkBlocksVisibilityController (): IGetThinkBlocksVisibilityController {
    const settingsRepository = createSettingsRepository(storage, logger);
    const getThinkBlocksVisibilityUseCase = new GetThinkBlocksVisibilityUseCase(logger, settingsRepository);
    return new GetThinkBlocksVisibilityController(logger, getThinkBlocksVisibilityUseCase);
}

export function saveThinkBlocksVisibilityController (): ISaveThinkBlocksVisibilityController {
    const settingsRepository = createSettingsRepository(storage, logger);
    const saveThinkBlocksVisibilityUseCase = new SaveThinkBlocksVisibilityUseCase(logger, settingsRepository);
    return new SaveThinkBlocksVisibilityController(logger, saveThinkBlocksVisibilityUseCase);
}

export function createGetChatTemplatesUseCase (): IGetChatTemplatesUseCase {
    const settingsRepository = createSettingsRepository(storage, logger);
    return new GetChatTemplatesUseCase(logger, settingsRepository);
}

export function getChatTemplatesController (): IGetChatTemplatesController {
    const getChatTemplatesUseCase = createGetChatTemplatesUseCase();
    return new GetChatTemplatesController(logger, getChatTemplatesUseCase);
}

export function saveChatTemplatesController (): ISaveChatTemplatesController {
    const settingsRepository = createSettingsRepository(storage, logger);
    const validateChatTemplatesService = new ValidateChatTemplatesService(logger);
    const saveChatTemplatesUseCase = new SaveChatTemplatesUseCase(logger, settingsRepository, validateChatTemplatesService);
    return new SaveChatTemplatesController(logger, saveChatTemplatesUseCase);
}
