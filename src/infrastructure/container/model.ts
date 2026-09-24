import { GetModelsFromProviderController, GetModelTemplateController } from '@adapters/controllers';
import { GetModelTemplateService } from '@application/services';
import { GetModelsFromProviderUseCase, GetModelTemplateUseCase } from '@application/use-cases';
import { IGetModelsFromProviderController, IGetModelTemplateController } from '@domain/controllers';
import { logger, getStreamProvider, idGenerate, hashProvider, storage } from './shared';
import { createModelTemplateRepository } from './repository';
import { LlamaCppOAGateway } from '../http/llama-cpp';

export function getModelsFromProviderController (): IGetModelsFromProviderController {
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const getModelsUseCase = new GetModelsFromProviderUseCase(logger, llamaCppOAGateway);
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
