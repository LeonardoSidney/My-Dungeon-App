import {
    CreateAdventureController,
    EditAdventureController,
    GetAdventuresController,
    AppendChatAdventureController,
    CreateChatAdventureController,
    EraseAdventuresController,
    EraseAdventureController,
    GetAdventureTextController,
    StartStreamingChatController,
    UpdateStreamingChatController,
    FinishStreamingChatController,
    IsAdventureStreamingController,
    HydrateAdventureController,
} from '@adapters/controllers';
import {
    CreateAdventureService,
    EditAdventureService,
    AppendChatAdventureService,
    CreateChatService,
    StartStreamingChatService,
    UpdateStreamingChatService,
    FinishStreamingChatService,
    IsAdventureStreamingService,
    GetSamplersService,
    TextGenerationTemplatesService,
} from '@application/services';
import {
    CreateAdventureUseCase,
    EditAdventureUseCase,
    GetAdventureUseCase,
    GetAdventureTextUseCase,
    AppendChatAdventureUseCase,
    CreateChatAdventureUseCase,
    EraseAdventuresUseCase,
    EraseAdventureUseCase,
    StartStreamingChatUseCase,
    UpdateStreamingChatUseCase,
    FinishStreamingChatUseCase,
    IsAdventureStreamingUseCase,
    HydrateAdventureUseCase,
} from '@application/use-cases';
import {
    ICreateAdventureController,
    IEditAdventureController,
    IGetAdventuresController,
    IAppendChatAdventureController,
    ICreateChatAdventureController,
    IEraseAdventuresController,
    IEraseAdventureController,
    IGetAdventureTextController,
    IStartStreamingChatController,
    IUpdateStreamingChatController,
    IFinishStreamingChatController,
    IIsAdventureStreamingController,
    IHydrateAdventureController,
} from '@domain/controllers';
import { IHydrateAdventureUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage, getStreamProvider } from './shared';
import {
    createAbilityRepository,
    createAdventureRepository,
    createAssistantRepository,
    createCharacterRepository,
    createConnectionRepository,
    createItemRepository,
    createLocationRepository,
    createProficiencyRepository,
    createSamplerRepository,
    createStatusRepository,
    createSystemPromptRepository,
    createWorldMasterRepository,
    createWorldRepository,
} from './repository';
import { LlamaCppOAGateway } from '../http/llama-cpp';
import { TextGeneration } from '../providers/textGeneration';

export function createHydrateAdventureUseCase (): IHydrateAdventureUseCase {
    return new HydrateAdventureUseCase(
        logger,
        createCharacterRepository(storage, logger),
        createWorldMasterRepository(storage, logger),
        createAssistantRepository(storage, logger),
        createConnectionRepository(storage, logger),
        createSamplerRepository(storage, logger),
        new GetSamplersService(logger),
        createWorldRepository(storage, logger),
        createLocationRepository(storage, logger),
        createItemRepository(storage, logger),
        createSystemPromptRepository(storage, logger),
        createAbilityRepository(storage, logger),
        createProficiencyRepository(storage, logger),
        createStatusRepository(storage, logger)
    );
}

export function createAdventureController (): ICreateAdventureController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const createAdventureService = new CreateAdventureService(logger, idGenerate);
    const createAdventureUseCase = new CreateAdventureUseCase(
        logger,
        createAdventureService,
        adventureRepository,
        createCharacterRepository(storage, logger),
        createSystemPromptRepository(storage, logger),
        createWorldRepository(storage, logger),
        createLocationRepository(storage, logger),
        createItemRepository(storage, logger),
        createWorldMasterRepository(storage, logger)
    );
    return new CreateAdventureController(logger, createAdventureUseCase);
}

export function editAdventureController (): IEditAdventureController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const editAdventureService = new EditAdventureService(logger);
    const editAdventureUseCase = new EditAdventureUseCase(
        logger,
        editAdventureService,
        adventureRepository,
        createCharacterRepository(storage, logger),
        createSystemPromptRepository(storage, logger),
        createWorldRepository(storage, logger),
        createLocationRepository(storage, logger),
        createItemRepository(storage, logger),
        createWorldMasterRepository(storage, logger)
    );
    return new EditAdventureController(logger, editAdventureUseCase);
}

export function getAdventuresController (): IGetAdventuresController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const getAdventuresUseCase = new GetAdventureUseCase(logger, adventureRepository);
    return new GetAdventuresController(logger, getAdventuresUseCase);
}

export function appendChatAdventureController (): IAppendChatAdventureController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const appendChatAdventureService = new AppendChatAdventureService(logger);
    const appendChatAdventureUseCase = new AppendChatAdventureUseCase(
        logger,
        adventureRepository,
        appendChatAdventureService
    );
    return new AppendChatAdventureController(logger, appendChatAdventureUseCase);
}

export function createChatAdventureController (): ICreateChatAdventureController {
    const createChatService = new CreateChatService(logger, idGenerate);
    const createChatAdventureUseCase = new CreateChatAdventureUseCase(logger, createChatService);
    return new CreateChatAdventureController(logger, createChatAdventureUseCase);
}

export function eraseAdventuresController (): IEraseAdventuresController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const eraseAdventuresUseCase = new EraseAdventuresUseCase(logger, adventureRepository);
    return new EraseAdventuresController(logger, eraseAdventuresUseCase);
}

export function eraseAdventureController (): IEraseAdventureController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const eraseAdventureUseCase = new EraseAdventureUseCase(logger, adventureRepository);
    return new EraseAdventureController(logger, eraseAdventureUseCase);
}

export function getAdventureTextController (): IGetAdventureTextController {
    const textGenerationTemplatesService = new TextGenerationTemplatesService(logger);
    const textGeneration = new TextGeneration(logger, textGenerationTemplatesService);
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const hydrateAdventureUseCase = createHydrateAdventureUseCase();
    const getAdventureTextUseCase = new GetAdventureTextUseCase(logger, textGeneration, llamaCppOAGateway, hydrateAdventureUseCase);
    return new GetAdventureTextController(logger, getAdventureTextUseCase);
}

export function hydrateAdventureController (): IHydrateAdventureController {
    const hydrateAdventureUseCase = createHydrateAdventureUseCase();
    return new HydrateAdventureController(logger, hydrateAdventureUseCase);
}

export function startStreamingChatController (): IStartStreamingChatController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const startStreamingChatService = new StartStreamingChatService(logger, idGenerate);
    const startStreamingChatUseCase = new StartStreamingChatUseCase(logger, startStreamingChatService, adventureRepository);
    return new StartStreamingChatController(logger, startStreamingChatUseCase);
}

export function updateStreamingChatController (): IUpdateStreamingChatController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const updateStreamingChatService = new UpdateStreamingChatService(logger);
    const updateStreamingChatUseCase = new UpdateStreamingChatUseCase(logger, updateStreamingChatService, adventureRepository);
    return new UpdateStreamingChatController(logger, updateStreamingChatUseCase);
}

export function finishStreamingChatController (): IFinishStreamingChatController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const finishStreamingChatService = new FinishStreamingChatService(logger);
    const finishStreamingChatUseCase = new FinishStreamingChatUseCase(logger, finishStreamingChatService, adventureRepository);
    return new FinishStreamingChatController(logger, finishStreamingChatUseCase);
}

export function isAdventureStreamingController (): IIsAdventureStreamingController {
    const isAdventureStreamingService = new IsAdventureStreamingService(logger);
    const isAdventureStreamingUseCase = new IsAdventureStreamingUseCase(logger, isAdventureStreamingService);
    return new IsAdventureStreamingController(logger, isAdventureStreamingUseCase);
}
