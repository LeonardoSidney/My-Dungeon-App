import {
    GetSystemPromptLoadOrderController,
    ResetSystemPromptLoadOrderController,
    SaveSystemPromptLoadOrderController,
} from '@adapters/controllers';
import { ValidateSystemPromptLoadOrderService } from '@application/services';
import {
    GetSystemPromptLoadOrderUseCase,
    ResetSystemPromptLoadOrderUseCase,
    SaveSystemPromptLoadOrderUseCase,
} from '@application/use-cases';
import {
    IGetSystemPromptLoadOrderController,
    IResetSystemPromptLoadOrderController,
    ISaveSystemPromptLoadOrderController,
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
