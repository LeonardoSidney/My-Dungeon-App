import { GetModelsController, GetModelsFromProviderController, GetModelTemplateController } from '@adapters/controllers';
import {
    GetModelsPresenter,
} from '@adapters/presenters';
import { GetModelTemplateService } from '@application/services';
import { GetModelsFromProviderUseCase, GetModelTemplateUseCase, ListModelsUseCase } from '@application/use-cases';
import { IGetModelsController, IGetModelsFromProviderController, IGetModelTemplateController } from '@domain/controllers';
import { logger, getStreamProvider, idGenerate, hashProvider, storage } from './shared';
import { createConnectionRepository, createModelTemplateRepository } from './repository';
import { LlamaCppOAGateway } from '../http/llama-cpp';

export function getModelsFromProviderController (): IGetModelsFromProviderController {
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const getModelsUseCase = new GetModelsFromProviderUseCase(logger, llamaCppOAGateway, createConnectionRepository(storage, logger));
    return new GetModelsFromProviderController(logger, getModelsUseCase);
}

export function getModelTemplateController (): IGetModelTemplateController {
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const modelTemplateRepository = createModelTemplateRepository(storage, logger);
    const getModelTemplateService = new GetModelTemplateService(logger, llamaCppOAGateway, idGenerate, hashProvider);
    const getModelTemplateUseCase = new GetModelTemplateUseCase(
        logger,
        modelTemplateRepository,
        getModelTemplateService,
        hashProvider
    );
    return new GetModelTemplateController(logger, getModelTemplateUseCase);
}

export function getModelsController (): IGetModelsController {
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const useCase = new ListModelsUseCase(logger, llamaCppOAGateway, createConnectionRepository(storage, logger));
    return new GetModelsController(logger, useCase, new GetModelsPresenter());
}
