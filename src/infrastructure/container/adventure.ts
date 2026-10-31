import {
    CreateAdventureController,
    EditAdventureController,
    GetAdventuresController,
    GetAdventureController,
    AppendChatAdventureController,
    AddChatVersionController,
    DeleteChatAdventureController,
    DeleteChatVersionController,
    AddThinkVersionController,
    DeleteThinkVersionController,
    ContinueFromChatController,
    RegenerateFromChatController,
    ResendChatController,
    EraseAdventuresController,
    EraseAdventureController,
    GetAdventureSystemPromptController,
    GetAdventureTemplatedPromptController,
    SelectChatVersionController,
    SetAdventureWorldMasterController,
    GetAdventureCharactersController,
    GetAdventureWorldMasterController,
    GetAdventureSummaryController,
    GetChatMessagesController,
    GetChatMessageController,
    GenerateChatReplyController,
    StopChatReplyController,
    SubscribeChatReplyController,
    RecoverInterruptedRepliesController,
    ApplyAdventureSettingsController,
} from '@adapters/controllers';
import {
    ChatMessagesPresenter,
    GetAdventureCharactersPresenter,
    GetAdventureWorldMasterPresenter,
    GetAdventureSummaryPresenter,
    GetAdventurePresenter,
    GetAdventuresPresenter,
} from '@adapters/presenters';
import {
    CreateAdventureService,
    EditAdventureService,
    AppendChatAdventureService,
    AddChatVersionService,
    DeleteChatAdventureService,
    DeleteChatVersionService,
    AddThinkVersionService,
    DeleteThinkVersionService,
    ContinueFromChatService,
    RegenerateFromChatService,
    ResendChatService,
    CreateChatService,
    StartStreamingChatService,
    UpdateStreamingChatService,
    FinishStreamingChatService,
    GetSamplersService,
    HydrateAdventureService,
    SelectChatVersionService,
    SetAdventureWorldMasterService,
    RecoverInterruptedChatsService,
    TurnSpeakerService,
} from '@application/services';
import {
    CreateAdventureUseCase,
    EditAdventureUseCase,
    GetAdventuresUseCase,
    GetAdventureByIdUseCase,
    GetAdventureTemplatedPromptUseCase,
    GetAdventureSystemPromptUseCase,
    AppendChatAdventureUseCase,
    AddChatVersionUseCase,
    DeleteChatAdventureUseCase,
    DeleteChatVersionUseCase,
    AddThinkVersionUseCase,
    DeleteThinkVersionUseCase,
    ContinueFromChatUseCase,
    RegenerateFromChatUseCase,
    ResendChatUseCase,
    EraseAdventuresUseCase,
    EraseAdventureUseCase,
    StartStreamingChatUseCase,
    UpdateStreamingChatUseCase,
    FinishStreamingChatUseCase,
    HydrateAdventureUseCase,
    SelectChatVersionUseCase,
    SetAdventureWorldMasterUseCase,
    GetAdventureCharactersUseCase,
    GetAdventureWorldMasterUseCase,
    GetChatMessagesUseCase,
    GetChatByIdUseCase,
    GenerateChatReplyUseCase,
    StopChatReplyUseCase,
    SubscribeChatReplyUseCase,
    RecoverInterruptedRepliesUseCase,
    NativeStreamCompletionUseCase,
    ApplyAdventureSettingsUseCase,
} from '@application/use-cases';
import {
    ICreateAdventureController,
    IEditAdventureController,
    IGetAdventuresController,
    IGetAdventureController,
    IAppendChatAdventureController,
    IAddChatVersionController,
    IDeleteChatAdventureController,
    IDeleteChatVersionController,
    IAddThinkVersionController,
    IDeleteThinkVersionController,
    IContinueFromChatController,
    IRegenerateFromChatController,
    IResendChatController,
    IEraseAdventuresController,
    IEraseAdventureController,
    IGetAdventureSystemPromptController,
    IGetAdventureTemplatedPromptController,
    ISelectChatVersionController,
    ISetAdventureWorldMasterController,
    IGetAdventureCharactersController,
    IGetAdventureWorldMasterController,
    IGetAdventureSummaryController,
    IGetChatMessagesController,
    IGetChatMessageController,
    IGenerateChatReplyController,
    IStopChatReplyController,
    ISubscribeChatReplyController,
    IRecoverInterruptedRepliesController,
    IApplyAdventureSettingsController,
} from '@domain/controllers';
import { IEditAdventureUseCase, IGetAdventuresUseCase, IHydrateAdventureUseCase } from '@domain/use-cases';
import { IHydrateAdventureService } from '@domain/services';
import {
    idGenerate,
    logger,
    storage,
    streamingLogger,
    streamingStorage,
    getStreamProvider,
    chatReplyBus,
    chatReplyRegistry,
} from './shared';
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
import { LlamaCppOAGateway, LlamaCppNativeGateway } from '../http/llama-cpp';
import { TextGeneration } from '../providers/textGeneration';
import { createGetChatTemplatesUseCase, createGetSceneContextEnabledUseCase, createGetSystemPromptLoadOrderUseCase } from './settings';
import { createEditCharacterUseCase, createGetCharacterByIdUseCase } from './character';
import { createEditWorldMasterUseCase, createGetWorldMasterByIdUseCase } from './worldMaster';
import { createEditAssistantUseCase, createGetAssistantByIdUseCase } from './assistant';
import { createEditSamplerUseCase, createGetSamplerByIdUseCase } from './sampler';

export function createHydrateAdventureService (): IHydrateAdventureService {
    return new HydrateAdventureService(
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

export function createHydrateAdventureUseCase (): IHydrateAdventureUseCase {
    const adventureRepository = createAdventureRepository(storage, logger);
    return new HydrateAdventureUseCase(
        logger,
        adventureRepository,
        createHydrateAdventureService()
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

function createEditAdventureUseCase (): IEditAdventureUseCase {
    const editAdventureService = new EditAdventureService(logger);
    const adventureRepository = createAdventureRepository(storage, logger);
    const characterRepository = createCharacterRepository(storage, logger);
    const systemPromptRepository = createSystemPromptRepository(storage, logger);
    const worldRepository = createWorldRepository(storage, logger);
    const locationRepository = createLocationRepository(storage, logger);
    const itemRepository = createItemRepository(storage, logger);
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    return new EditAdventureUseCase(
        logger,
        editAdventureService,
        adventureRepository,
        characterRepository,
        systemPromptRepository,
        worldRepository,
        locationRepository,
        itemRepository,
        worldMasterRepository
    );
}

export function editAdventureController (): IEditAdventureController {
    const editAdventureUseCase = createEditAdventureUseCase();
    return new EditAdventureController(logger, editAdventureUseCase);
}

export function applyAdventureSettingsController (): IApplyAdventureSettingsController {
    const editAdventureUseCase = createEditAdventureUseCase();
    const getCharacterByIdUseCase = createGetCharacterByIdUseCase();
    const editCharacterUseCase = createEditCharacterUseCase();
    const getWorldMasterByIdUseCase = createGetWorldMasterByIdUseCase();
    const editWorldMasterUseCase = createEditWorldMasterUseCase();
    const getAssistantByIdUseCase = createGetAssistantByIdUseCase();
    const editAssistantUseCase = createEditAssistantUseCase();
    const getSamplerByIdUseCase = createGetSamplerByIdUseCase();
    const editSamplerUseCase = createEditSamplerUseCase();
    const applyAdventureSettingsUseCase = new ApplyAdventureSettingsUseCase(
        logger,
        editAdventureUseCase,
        getCharacterByIdUseCase,
        editCharacterUseCase,
        getWorldMasterByIdUseCase,
        editWorldMasterUseCase,
        getAssistantByIdUseCase,
        editAssistantUseCase,
        getSamplerByIdUseCase,
        editSamplerUseCase
    );
    return new ApplyAdventureSettingsController(logger, applyAdventureSettingsUseCase);
}

export function createGetAdventuresUseCase (): IGetAdventuresUseCase {
    const adventureRepository = createAdventureRepository(storage, logger);
    return new GetAdventuresUseCase(logger, adventureRepository);
}

export function getAdventuresController (): IGetAdventuresController {
    const getAdventuresUseCase = createGetAdventuresUseCase();
    return new GetAdventuresController(logger, getAdventuresUseCase, new GetAdventuresPresenter());
}

export function getAdventureController (): IGetAdventureController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const getAdventureUseCase = new GetAdventureByIdUseCase(logger, adventureRepository);
    return new GetAdventureController(logger, getAdventureUseCase, new GetAdventurePresenter());
}

export function appendChatAdventureController (): IAppendChatAdventureController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const appendChatAdventureService = new AppendChatAdventureService(logger);
    const appendChatAdventureUseCase = new AppendChatAdventureUseCase(
        logger,
        adventureRepository,
        appendChatAdventureService,
        new CreateChatService(logger, idGenerate)
    );
    return new AppendChatAdventureController(logger, appendChatAdventureUseCase);
}

export function addChatVersionController (): IAddChatVersionController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const addChatVersionService = new AddChatVersionService(logger);
    const addChatVersionUseCase = new AddChatVersionUseCase(
        logger,
        addChatVersionService,
        adventureRepository
    );
    return new AddChatVersionController(logger, addChatVersionUseCase);
}

export function addThinkVersionController (): IAddThinkVersionController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const addThinkVersionService = new AddThinkVersionService(logger, idGenerate);
    const addThinkVersionUseCase = new AddThinkVersionUseCase(
        logger,
        addThinkVersionService,
        adventureRepository
    );
    return new AddThinkVersionController(logger, addThinkVersionUseCase);
}

export function deleteChatAdventureController (): IDeleteChatAdventureController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const deleteChatAdventureService = new DeleteChatAdventureService(logger);
    const deleteChatAdventureUseCase = new DeleteChatAdventureUseCase(
        logger,
        deleteChatAdventureService,
        adventureRepository
    );
    return new DeleteChatAdventureController(logger, deleteChatAdventureUseCase);
}

export function deleteThinkVersionController (): IDeleteThinkVersionController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const deleteThinkVersionService = new DeleteThinkVersionService(logger);
    const deleteThinkVersionUseCase = new DeleteThinkVersionUseCase(
        logger,
        deleteThinkVersionService,
        adventureRepository
    );
    return new DeleteThinkVersionController(logger, deleteThinkVersionUseCase);
}

export function deleteChatVersionController (): IDeleteChatVersionController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const useCase = new DeleteChatVersionUseCase(logger, new DeleteChatVersionService(logger), adventureRepository);
    return new DeleteChatVersionController(logger, useCase);
}

export function continueFromChatController (): IContinueFromChatController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const continueFromChatService = new ContinueFromChatService(logger);
    const continueFromChatUseCase = new ContinueFromChatUseCase(
        logger,
        continueFromChatService,
        adventureRepository
    );
    return new ContinueFromChatController(logger, continueFromChatUseCase);
}

export function regenerateFromChatController (): IRegenerateFromChatController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const regenerateFromChatService = new RegenerateFromChatService(logger, idGenerate);
    const regenerateFromChatUseCase = new RegenerateFromChatUseCase(
        logger,
        regenerateFromChatService,
        adventureRepository
    );
    return new RegenerateFromChatController(logger, regenerateFromChatUseCase);
}

export function resendChatController (): IResendChatController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const resendChatService = new ResendChatService(logger);
    const resendChatUseCase = new ResendChatUseCase(
        logger,
        resendChatService,
        adventureRepository
    );
    return new ResendChatController(logger, resendChatUseCase);
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

export function getAdventureSystemPromptController (): IGetAdventureSystemPromptController {
    const textGeneration = new TextGeneration(logger);
    const getChatTemplatesUseCase = createGetChatTemplatesUseCase();
    const useCase = new GetAdventureSystemPromptUseCase(
        logger,
        textGeneration,
        createHydrateAdventureUseCase(),
        createGetSystemPromptLoadOrderUseCase(),
        getChatTemplatesUseCase
    );
    return new GetAdventureSystemPromptController(logger, useCase);
}

export function getAdventureTemplatedPromptController (): IGetAdventureTemplatedPromptController {
    const textGeneration = new TextGeneration(logger);
    const turnSpeakerService = new TurnSpeakerService(logger);
    const getChatTemplatesUseCase = createGetChatTemplatesUseCase();
    const useCase = new GetAdventureTemplatedPromptUseCase(
        logger,
        textGeneration,
        new LlamaCppOAGateway(logger, getStreamProvider()),
        createHydrateAdventureUseCase(),
        createGetSystemPromptLoadOrderUseCase(),
        getChatTemplatesUseCase,
        turnSpeakerService
    );
    return new GetAdventureTemplatedPromptController(logger, useCase);
}

export function selectChatVersionController (): ISelectChatVersionController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const service = new SelectChatVersionService(logger);
    const useCase = new SelectChatVersionUseCase(logger, service, adventureRepository);
    return new SelectChatVersionController(logger, useCase);
}

export function setAdventureWorldMasterController (): ISetAdventureWorldMasterController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const worldMasterRepository = createWorldMasterRepository(storage, logger);
    const service = new SetAdventureWorldMasterService(logger);
    const useCase = new SetAdventureWorldMasterUseCase(logger, service, adventureRepository, worldMasterRepository);
    return new SetAdventureWorldMasterController(logger, useCase);
}

export function getAdventureCharactersController (): IGetAdventureCharactersController {
    const useCase = new GetAdventureCharactersUseCase(
        logger,
        createAdventureRepository(storage, logger),
        createCharacterRepository(storage, logger)
    );
    return new GetAdventureCharactersController(logger, useCase, new GetAdventureCharactersPresenter());
}

export function getAdventureWorldMasterController (): IGetAdventureWorldMasterController {
    const useCase = new GetAdventureWorldMasterUseCase(
        logger,
        createAdventureRepository(storage, logger),
        createWorldMasterRepository(storage, logger)
    );
    return new GetAdventureWorldMasterController(logger, useCase, new GetAdventureWorldMasterPresenter());
}

export function getAdventureSummaryController (): IGetAdventureSummaryController {
    const useCase = new GetAdventureByIdUseCase(logger, createAdventureRepository(storage, logger));
    return new GetAdventureSummaryController(logger, useCase, new GetAdventureSummaryPresenter());
}

export function generateChatReplyController (): IGenerateChatReplyController {
    const adventureRepository = createAdventureRepository(storage, logger);
    const textGeneration = new TextGeneration(logger);
    const hydrateAdventureUseCase = createHydrateAdventureUseCase();
    const turnSpeakerService = new TurnSpeakerService(logger);
    const getChatTemplatesUseCase = createGetChatTemplatesUseCase();
    const getAdventureTemplatedPromptUseCase = new GetAdventureTemplatedPromptUseCase(
        logger,
        textGeneration,
        new LlamaCppOAGateway(logger, getStreamProvider()),
        hydrateAdventureUseCase,
        createGetSystemPromptLoadOrderUseCase(),
        getChatTemplatesUseCase,
        turnSpeakerService
    );
    const getSceneContextEnabledUseCase = createGetSceneContextEnabledUseCase();
    const nativeStreamCompletionUseCase = new NativeStreamCompletionUseCase(
        logger,
        new LlamaCppNativeGateway(logger, getStreamProvider()),
        createConnectionRepository(storage, logger),
        createSamplerRepository(storage, logger),
        new GetSamplersService(logger)
    );
    const streamingAdventureRepository = createAdventureRepository(streamingStorage, streamingLogger);
    const updateStreamingChatService = new UpdateStreamingChatService(streamingLogger);
    const updateStreamingChatUseCase = new UpdateStreamingChatUseCase(streamingLogger, updateStreamingChatService, streamingAdventureRepository);
    const useCase = new GenerateChatReplyUseCase(
        logger,
        idGenerate,
        hydrateAdventureUseCase,
        turnSpeakerService,
        getAdventureTemplatedPromptUseCase,
        getSceneContextEnabledUseCase,
        nativeStreamCompletionUseCase,
        new StartStreamingChatUseCase(logger, new StartStreamingChatService(logger, idGenerate), adventureRepository),
        updateStreamingChatUseCase,
        new FinishStreamingChatUseCase(logger, new FinishStreamingChatService(logger), adventureRepository),
        new DeleteChatAdventureUseCase(logger, new DeleteChatAdventureService(logger), adventureRepository),
        new DeleteChatVersionUseCase(logger, new DeleteChatVersionService(logger), adventureRepository),
        chatReplyBus,
        chatReplyRegistry
    );
    return new GenerateChatReplyController(logger, useCase);
}

export function getChatMessagesController (): IGetChatMessagesController {
    const useCase = new GetChatMessagesUseCase(logger, createAdventureRepository(storage, logger));
    return new GetChatMessagesController(logger, useCase, new ChatMessagesPresenter());
}

export function getChatMessageController (): IGetChatMessageController {
    const streamingAdventureRepository = createAdventureRepository(streamingStorage, streamingLogger);
    const getChatByIdUseCase = new GetChatByIdUseCase(streamingLogger, streamingAdventureRepository);
    const chatMessagesPresenter = new ChatMessagesPresenter();
    return new GetChatMessageController(streamingLogger, getChatByIdUseCase, chatMessagesPresenter);
}

export function stopChatReplyController (): IStopChatReplyController {
    return new StopChatReplyController(logger, new StopChatReplyUseCase(logger, chatReplyRegistry));
}

export function subscribeChatReplyController (): ISubscribeChatReplyController {
    return new SubscribeChatReplyController(logger, new SubscribeChatReplyUseCase(logger, chatReplyBus, chatReplyRegistry));
}

export function recoverInterruptedRepliesController (): IRecoverInterruptedRepliesController {
    const service = new RecoverInterruptedChatsService(
        logger,
        new FinishStreamingChatService(logger),
        new DeleteChatVersionService(logger),
        new DeleteChatAdventureService(logger)
    );
    const useCase = new RecoverInterruptedRepliesUseCase(logger, createAdventureRepository(storage, logger), service, chatReplyRegistry);
    return new RecoverInterruptedRepliesController(logger, useCase);
}
