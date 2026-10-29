import {
    GetSystemPromptLoadOrderController,
    GetThinkBlocksVisibilityController,
    ResetSystemPromptLoadOrderController,
    SaveSystemPromptLoadOrderController,
    SaveThinkBlocksVisibilityController,
} from '@adapters/controllers';
import { ValidateSystemPromptLoadOrderService } from '@application/services';
import {
    GetSystemPromptLoadOrderUseCase,
    GetThinkBlocksVisibilityUseCase,
    ResetSystemPromptLoadOrderUseCase,
    SaveSystemPromptLoadOrderUseCase,
    SaveThinkBlocksVisibilityUseCase,
} from '@application/use-cases';
import {
    IGetSystemPromptLoadOrderController,
    IGetThinkBlocksVisibilityController,
    IResetSystemPromptLoadOrderController,
    ISaveSystemPromptLoadOrderController,
    ISaveThinkBlocksVisibilityController,
} from '@domain/controllers';
import { IGetSystemPromptLoadOrderUseCase } from '@domain/use-cases';
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
