import {
    GetDraftController,
    SaveDraftController,
    StartDraftCompletionController,
    StopDraftCompletionController,
    SubscribeDraftController,
} from '@adapters/controllers';
import { DraftPresenter } from '@adapters/presenters';
import { GetSamplersService, WriteDraftService } from '@application/services';
import {
    GetDraftByIdUseCase,
    ListModelsUseCase,
    SaveDraftUseCase,
    StartDraftCompletionUseCase,
    StopDraftCompletionUseCase,
    StreamCompletionUseCase,
    StreamPromptCompletionUseCase,
    SubscribeDraftUseCase,
} from '@application/use-cases';
import {
    IGetDraftController,
    ISaveDraftController,
    IStartDraftCompletionController,
    IStopDraftCompletionController,
    ISubscribeDraftController,
} from '@domain/controllers';
import { IStreamPromptCompletionUseCase } from '@domain/use-cases';
import { logger, getStreamProvider, storage, draftBus, draftRegistry } from './shared';
import { createConnectionRepository, createDraftRepository, createSamplerRepository } from './repository';
import { LlamaCppOAGateway } from '../http/llama-cpp';

function createStreamPromptCompletionUseCase (): IStreamPromptCompletionUseCase {
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const connectionRepository = createConnectionRepository(storage, logger);
    const samplerRepository = createSamplerRepository(storage, logger);
    const getSamplersService = new GetSamplersService(logger);
    const streamCompletionUseCase = new StreamCompletionUseCase(logger, llamaCppOAGateway, connectionRepository, samplerRepository, getSamplersService);
    const listModelsUseCase = new ListModelsUseCase(logger, llamaCppOAGateway, connectionRepository);
    return new StreamPromptCompletionUseCase(logger, listModelsUseCase, streamCompletionUseCase);
}

export function getDraftController (): IGetDraftController {
    const useCase = new GetDraftByIdUseCase(logger, createDraftRepository(storage, logger));
    return new GetDraftController(logger, useCase, new DraftPresenter());
}

export function saveDraftController (): ISaveDraftController {
    const useCase = new SaveDraftUseCase(logger, createDraftRepository(storage, logger), new WriteDraftService(logger), draftBus, draftRegistry);
    return new SaveDraftController(logger, useCase);
}

export function startDraftCompletionController (): IStartDraftCompletionController {
    const useCase = new StartDraftCompletionUseCase(
        logger,
        createDraftRepository(storage, logger),
        new WriteDraftService(logger),
        createStreamPromptCompletionUseCase(),
        draftBus,
        draftRegistry
    );
    return new StartDraftCompletionController(logger, useCase);
}

export function stopDraftCompletionController (): IStopDraftCompletionController {
    return new StopDraftCompletionController(logger, new StopDraftCompletionUseCase(logger, draftRegistry));
}

export function subscribeDraftController (): ISubscribeDraftController {
    return new SubscribeDraftController(logger, new SubscribeDraftUseCase(logger, draftBus, draftRegistry));
}
