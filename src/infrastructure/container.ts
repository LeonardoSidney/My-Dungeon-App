import {
    CreateAbilityController,
    EditAbilityController,
    EraseAbilityController,
    CreateAdventureController,
    EditAdventureController,
    CreateAssistantController,
    CreateConnectionConfigController,
    CreateSamplerController,
    EditSamplerController,
    EraseSamplerController,
    GetAbilitiesController,
    GetAssistantsController,
    GetConnectionsController,
    GetModelsFromProviderController,
    StreamCompletionController,
    GetSamplersController,
    CreateStatusController,
    EditStatusController,
    EraseStatusController,
    GetStatusesController,
    CreateProficiencyController,
    GetProficienciesController,
    EditProficiencyController,
    EraseProficiencyController,
    CreateCharacterController,
    GetCharactersController,
    EditCharacterController,
    EraseCharacterController,
    CreateWorldMasterController,
    EditWorldMasterController,
    EraseWorldMasterController,
    GetWorldMastersController,
    CreateWorldController,
    EraseWorldController,
    EditWorldController,
    GetWorldsController,
    CreateLocationController,
    GetLocationsController,
    CreateItemController,
    GetItemsController,
    CreateSystemPromptController,
    GetSystemPromptsController,
    EditSystemPromptController,
    EraseSystemPromptController,
    GetAdventuresController,
    GetAdventureTextController,
    AdventureAppendChatController,
    CreateChatAdventureController,
    EraseAdventuresController,
    EraseAdventureController,
    EraseConnectionController,
    EditConnectionController,
    EditAssistantController,
    EraseAssistantController
} from '@adapters/controllers';
import {
    CreateAbilityService,
    EditAbilityService,
    CreateAdventureService,
    EditAdventureService,
    CreateAssistantService,
    CreateChatService,
    CreateConnectionConfigService,
    CreateSamplerService,
    EditSamplerService,
    GetSamplersService,
    CreateStatusService,
    EditStatusService,
    CreateProficiencyService,
    EditProficiencyService,
    CreateCharacterService,
    EditCharacterService,
    CreateWorldMasterService,
    EditWorldMasterService,
    CreateWorldService,
    EditWorldService,
    CreateLocationService,
    CreateItemService,
    CreateSystemPromptService,
    EditSystemPromptService,
    AdventureAppendChatService,
    EditConnectionConfigService,
    EditAssistantService
} from '@application/services';
import {
    CreateAbilityUseCase,
    EditAbilityUseCase,
    EraseAbilityUseCase,
    CreateAdventureUseCase,
    EditAdventureUseCase,
    CreateAssistantUseCase,
    CreateConnectionConfigUseCase,
    CreateSamplerUseCase,
    EditSamplerUseCase,
    EraseSamplerUseCase,
    GetAbilitiesUseCase,
    GetAssistantsUseCase,
    GetConnectionsUseCase,
    GetModelsFromProviderUseCase,
    StreamCompletionUseCase,
    GetSamplersUseCase,
    CreateStatusUseCase,
    EditStatusUseCase,
    EraseStatusUseCase,
    GetStatusesUseCase,
    CreateProficiencyUseCase,
    GetProficienciesUseCase,
    EditProficiencyUseCase,
    EraseProficiencyUseCase,
    CreateCharacterUseCase,
    GetCharactersUseCase,
    EditCharacterUseCase,
    EraseCharacterUseCase,
    CreateWorldMasterUseCase,
    EditWorldMasterUseCase,
    EraseWorldMasterUseCase,
    GetWorldMastersUseCase,
    CreateWorldUseCase,
    EraseWorldUseCase,
    EditWorldUseCase,
    GetWorldsUseCase,
    CreateLocationUseCase,
    GetLocationsUseCase,
    CreateItemUseCase,
    GetItemsUseCase,
    CreateSystemPromptUseCase,
    GetSystemPromptsUseCase,
    EditSystemPromptUseCase,
    EraseSystemPromptUseCase,
    GetAdventureUseCase,
    GetAdventureTextUseCase,
    AdventureAppendChatUseCase,
    CreateChatAdventureUseCase,
    EraseAdventuresUseCase,
    EraseAdventureUseCase,
    EraseConnectionUseCase,
    EditConnectionUseCase,
    EditAssistantUseCase,
    EraseAssistantUseCase
} from '../application/use-cases';
import {
    ICreateAbilityController,
    IEditAbilityController,
    IEraseAbilityController,
    IEditAdventureController,
    ICreateAdventureController,
    ICreateAssistantController,
    ICreateConnectionConfigController,
    ICreateSamplerController,
    IEditSamplerController,
    IEraseSamplerController,
    IGetAbilitiesController,
    IGetAssistantsController,
    IGetConnectionsController,
    IGetModelsFromProviderController,
    IStreamCompletionController,
    IGetSamplersController,
    ICreateStatusController,
    IEditStatusController,
    IEraseStatusController,
    IGetStatusesController,
    ICreateProficiencyController,
    IGetProficienciesController,
    IEditProficiencyController,
    IEraseProficiencyController,
    ICreateCharacterController,
    IGetCharactersController,
    IEditCharacterController,
    IEraseCharacterController,
    ICreateWorldMasterController,
    IEditWorldMasterController,
    IEraseWorldMasterController,
    IGetWorldMastersController,
    ICreateWorldController,
    IEraseWorldController,
    IEditWorldController,
    IGetWorldsController,
    ICreateLocationController,
    IGetLocationsController,
    ICreateItemController,
    IGetItemsController,
    ICreateSystemPromptController,
    IGetSystemPromptsController,
    IEditSystemPromptController,
    IEraseSystemPromptController,
    IGetAdventuresController,
    IGetAdventureTextController,
    IAdventureAppendChatController,
    ICreateChatAdventureController,
    IEraseAdventuresController,
    IEraseAdventureController,
    IEraseConnectionController,
    IEditConnectionController,
    IEditAssistantController,
    IEraseAssistantController
} from '@domain/controllers';
import { LlamaCppGateway } from './http/llama-cpp';
import { Logger } from './logger';
import { UUIDGenerator } from './providers';
import { TextGeneration } from './providers/textGeneration';
import {
    AbilityRepository,
    AssistantRepository,
    ConnectionRepository,
    SamplerRepository,
    StatusRepository,
    ProficiencyRepository,
    CharacterRepository,
    WorldMasterRepository,
    WorldRepository,
    LocationRepository,
    ItemRepository,
    SystemPromptRepository,
    AdventureRepository
} from './repository';
import { MobileStorage } from './storage';
import { ReactNativeStreamProvider, WebStreamProvider } from '@infra/providers/http/stream';
import { Platform } from 'react-native';
import { IStreamProvider } from '@domain/providers';

const logger = new Logger();
const idGenerate = new UUIDGenerator();
const storage = new MobileStorage(logger);


export function getStreamProvider (): IStreamProvider {
    if (Platform.OS === 'web') {
        return new WebStreamProvider(logger);
    }

    return new ReactNativeStreamProvider(logger);
}

export function createConnectionConfigController (): ICreateConnectionConfigController {
    const createConnectionConfigService = new CreateConnectionConfigService(logger, idGenerate);
    const connectionRepository = new ConnectionRepository(logger, storage);
    const createConnectionConfigUseCase = new CreateConnectionConfigUseCase(logger, createConnectionConfigService, connectionRepository);
    return new CreateConnectionConfigController(logger, createConnectionConfigUseCase);
}

export function getConnectionsController (): IGetConnectionsController {
    const connectionRepository = new ConnectionRepository(logger, storage);
    const getConnectionsUseCase = new GetConnectionsUseCase(logger, connectionRepository);
    return new GetConnectionsController(logger, getConnectionsUseCase);
}

export function getModelsFromProviderController (): IGetModelsFromProviderController {
    const llamaCppGateway = new LlamaCppGateway(logger, getStreamProvider());
    const getModelsUseCase = new GetModelsFromProviderUseCase(logger, llamaCppGateway);
    return new GetModelsFromProviderController(logger, getModelsUseCase);
}

export function getStreamCompletionController (): IStreamCompletionController {
    const llamaCppGateway = new LlamaCppGateway(logger, getStreamProvider());
    const useCase = new StreamCompletionUseCase(logger, llamaCppGateway);
    return new StreamCompletionController(logger, useCase);
}

export function createSamplerController (): ICreateSamplerController {
    const createSamplerService = new CreateSamplerService(logger, idGenerate);
    const samplerRepository = new SamplerRepository(logger, storage);
    const createSamplerUseCase = new CreateSamplerUseCase(logger, samplerRepository, createSamplerService);
    return new CreateSamplerController(logger, createSamplerUseCase);
}

export function getSamplersController (): IGetSamplersController {
    const samplerRepository = new SamplerRepository(logger, storage);
    const getSamplersService = new GetSamplersService(logger);
    const getSamplersUseCase = new GetSamplersUseCase(logger, getSamplersService, samplerRepository);
    return new GetSamplersController(logger, getSamplersUseCase);
}

export function editSamplerController (): IEditSamplerController {
    const samplerRepository = new SamplerRepository(logger, storage);
    const editSamplerService = new EditSamplerService(logger);
    const editSamplerUseCase = new EditSamplerUseCase(logger, editSamplerService, samplerRepository);
    return new EditSamplerController(logger, editSamplerUseCase);
}

export function eraseSamplerController (): IEraseSamplerController {
    const samplerRepository = new SamplerRepository(logger, storage);
    const eraseSamplerUseCase = new EraseSamplerUseCase(logger, samplerRepository);
    return new EraseSamplerController(logger, eraseSamplerUseCase);
}

export function createAssistantController (): ICreateAssistantController {
    const createAssistantService = new CreateAssistantService(logger, idGenerate);
    const assistantRepository = new AssistantRepository(logger, storage);
    const createAssistantUseCase = new CreateAssistantUseCase(logger, assistantRepository, createAssistantService);
    return new CreateAssistantController(logger, createAssistantUseCase);
}

export function getAssistantsController (): IGetAssistantsController {
    const assistantRepository = new AssistantRepository(logger, storage);
    const getAssistantsUseCase = new GetAssistantsUseCase(logger, assistantRepository);
    return new GetAssistantsController(logger, getAssistantsUseCase);
}

export function editAssistantController (): IEditAssistantController {
    const assistantRepository = new AssistantRepository(logger, storage);
    const editAssistantService = new EditAssistantService(logger);
    const editAssistantUseCase = new EditAssistantUseCase(logger, editAssistantService, assistantRepository);
    return new EditAssistantController(logger, editAssistantUseCase);
}

export function eraseAssistantController (): IEraseAssistantController {
    const assistantRepository = new AssistantRepository(logger, storage);
    const eraseAssistantUseCase = new EraseAssistantUseCase(logger, assistantRepository);
    return new EraseAssistantController(logger, eraseAssistantUseCase);
}

export function createAbilityController (): ICreateAbilityController {
    const createAbilityService = new CreateAbilityService(logger, idGenerate);
    const abilityRepository = new AbilityRepository(logger, storage);
    const createAbilityUseCase = new CreateAbilityUseCase(logger, createAbilityService, abilityRepository);
    return new CreateAbilityController(logger, createAbilityUseCase);
}

export function getAbilitiesController (): IGetAbilitiesController {
    const abilityRepository = new AbilityRepository(logger, storage);
    const getAbilitiesUseCase = new GetAbilitiesUseCase(logger, abilityRepository);
    return new GetAbilitiesController(logger, getAbilitiesUseCase);
}

export function editAbilityController (): IEditAbilityController {
    const abilityRepository = new AbilityRepository(logger, storage);
    const editAbilityService = new EditAbilityService(logger);
    const editAbilityUseCase = new EditAbilityUseCase(logger, editAbilityService, abilityRepository);
    return new EditAbilityController(logger, editAbilityUseCase);
}

export function eraseAbilityController (): IEraseAbilityController {
    const abilityRepository = new AbilityRepository(logger, storage);
    const eraseAbilityUseCase = new EraseAbilityUseCase(logger, abilityRepository);
    return new EraseAbilityController(logger, eraseAbilityUseCase);
}

export function createStatusController (): ICreateStatusController {
    const createStatusService = new CreateStatusService(logger, idGenerate);
    const statusRepository = new StatusRepository(logger, storage);
    const createStatusUseCase = new CreateStatusUseCase(logger, createStatusService, statusRepository);
    return new CreateStatusController(logger, createStatusUseCase);
}

export function getStatusesController (): IGetStatusesController {
    const statusRepository = new StatusRepository(logger, storage);
    const getStatusesUseCase = new GetStatusesUseCase(logger, statusRepository);
    return new GetStatusesController(logger, getStatusesUseCase);
}

export function editStatusController (): IEditStatusController {
    const statusRepository = new StatusRepository(logger, storage);
    const editStatusService = new EditStatusService(logger);
    const editStatusUseCase = new EditStatusUseCase(logger, editStatusService, statusRepository);
    return new EditStatusController(logger, editStatusUseCase);
}

export function eraseStatusController (): IEraseStatusController {
    const statusRepository = new StatusRepository(logger, storage);
    const eraseStatusUseCase = new EraseStatusUseCase(logger, statusRepository);
    return new EraseStatusController(logger, eraseStatusUseCase);
}

export function createProficiencyController (): ICreateProficiencyController {
    const createProficiencyService = new CreateProficiencyService(logger, idGenerate);
    const proficiencyRepository = new ProficiencyRepository(logger, storage);
    const createProficiencyUseCase = new CreateProficiencyUseCase(logger, createProficiencyService, proficiencyRepository);
    return new CreateProficiencyController(logger, createProficiencyUseCase);
}

export function getProficienciesController (): IGetProficienciesController {
    const proficiencyRepository = new ProficiencyRepository(logger, storage);
    const getProficienciesUseCase = new GetProficienciesUseCase(logger, proficiencyRepository);
    return new GetProficienciesController(logger, getProficienciesUseCase);
}

export function editProficiencyController (): IEditProficiencyController {
    const proficiencyRepository = new ProficiencyRepository(logger, storage);
    const editProficiencyService = new EditProficiencyService(logger);
    const editProficiencyUseCase = new EditProficiencyUseCase(logger, editProficiencyService, proficiencyRepository);
    return new EditProficiencyController(logger, editProficiencyUseCase);
}

export function eraseProficiencyController (): IEraseProficiencyController {
    const proficiencyRepository = new ProficiencyRepository(logger, storage);
    const eraseProficiencyUseCase = new EraseProficiencyUseCase(logger, proficiencyRepository);
    return new EraseProficiencyController(logger, eraseProficiencyUseCase);
}

export function createCharacterController (): ICreateCharacterController {
    const characterRepository = new CharacterRepository(logger, storage);
    const createCharacterService = new CreateCharacterService(logger, idGenerate);
    const createCharacterUseCase = new CreateCharacterUseCase(logger, characterRepository, createCharacterService);
    return new CreateCharacterController(logger, createCharacterUseCase);
}

export function getCharactersController (): IGetCharactersController {
    const characterRepository = new CharacterRepository(logger, storage);
    const getCharactersUseCase = new GetCharactersUseCase(logger, characterRepository);
    return new GetCharactersController(logger, getCharactersUseCase);
}

export function editCharacterController (): IEditCharacterController {
    const characterRepository = new CharacterRepository(logger, storage);
    const editCharacterService = new EditCharacterService(logger);
    const editCharacterUseCase = new EditCharacterUseCase(logger, editCharacterService, characterRepository);
    return new EditCharacterController(logger, editCharacterUseCase);
}

export function eraseCharacterController (): IEraseCharacterController {
    const characterRepository = new CharacterRepository(logger, storage);
    const eraseCharacterUseCase = new EraseCharacterUseCase(logger, characterRepository);
    return new EraseCharacterController(logger, eraseCharacterUseCase);
}

export function createWorldMasterController (): ICreateWorldMasterController {
    const worldMasterRepository = new WorldMasterRepository(logger, storage);
    const createWorldMasterService = new CreateWorldMasterService(logger, idGenerate);
    const createWorldMasterUseCase = new CreateWorldMasterUseCase(logger, worldMasterRepository, createWorldMasterService);
    return new CreateWorldMasterController(logger, createWorldMasterUseCase);
}

export function getWorldMasterController (): IGetWorldMastersController {
    const worldMasterRepository = new WorldMasterRepository(logger, storage);
    const getWorldMasterUseCase = new GetWorldMastersUseCase(logger, worldMasterRepository);
    return new GetWorldMastersController(logger, getWorldMasterUseCase);
}

export function editWorldMasterController (): IEditWorldMasterController {
    const worldMasterRepository = new WorldMasterRepository(logger, storage);
    const editWorldMasterService = new EditWorldMasterService(logger);
    const editWorldMasterUseCase = new EditWorldMasterUseCase(logger, editWorldMasterService, worldMasterRepository);
    return new EditWorldMasterController(logger, editWorldMasterUseCase);
}

export function eraseWorldMasterController (): IEraseWorldMasterController {
    const worldMasterRepository = new WorldMasterRepository(logger, storage);
    const eraseWorldMasterUseCase = new EraseWorldMasterUseCase(logger, worldMasterRepository);
    return new EraseWorldMasterController(logger, eraseWorldMasterUseCase);
}

export function createSystemPromptController (): ICreateSystemPromptController {
    const systemPromptRepository = new SystemPromptRepository(logger, storage);
    const createSystemPromptService = new CreateSystemPromptService(logger, idGenerate);
    const createSystemPromptUseCase = new CreateSystemPromptUseCase(logger, systemPromptRepository, createSystemPromptService);
    return new CreateSystemPromptController(logger, createSystemPromptUseCase);
}

export function getSystemPromptsController (): IGetSystemPromptsController {
    const systemPromptRepository = new SystemPromptRepository(logger, storage);
    const getSystemPromptsUseCase = new GetSystemPromptsUseCase(logger, systemPromptRepository);
    return new GetSystemPromptsController(logger, getSystemPromptsUseCase);
}

export function editSystemPromptController (): IEditSystemPromptController {
    const systemPromptRepository = new SystemPromptRepository(logger, storage);
    const editSystemPromptService = new EditSystemPromptService(logger);
    const editSystemPromptUseCase = new EditSystemPromptUseCase(logger, editSystemPromptService, systemPromptRepository);
    return new EditSystemPromptController(logger, editSystemPromptUseCase);
}

export function eraseSystemPromptController (): IEraseSystemPromptController {
    const systemPromptRepository = new SystemPromptRepository(logger, storage);
    const eraseSystemPromptUseCase = new EraseSystemPromptUseCase(logger, systemPromptRepository);
    return new EraseSystemPromptController(logger, eraseSystemPromptUseCase);
}

export function createWorldController (): ICreateWorldController {
    const worldRepository = new WorldRepository(logger, storage);
    const createWorldService = new CreateWorldService(logger, idGenerate);
    const createWorldUseCase = new CreateWorldUseCase(logger, worldRepository, createWorldService);
    return new CreateWorldController(logger, createWorldUseCase);
}

export function getWorldsController (): IGetWorldsController {
    const worldRepository = new WorldRepository(logger, storage);
    const getWorldsUseCase = new GetWorldsUseCase(logger, worldRepository);
    return new GetWorldsController(logger, getWorldsUseCase);
}

export function eraseWorldController (): IEraseWorldController {
    const worldRepository = new WorldRepository(logger, storage);
    const eraseWorldUseCase = new EraseWorldUseCase(logger, worldRepository);
    return new EraseWorldController(logger, eraseWorldUseCase);
}

export function editWorldController (): IEditWorldController {
    const editWorldService = new EditWorldService(logger);
    const worldRepository = new WorldRepository(logger, storage);
    const editWorldUseCase = new EditWorldUseCase(logger, editWorldService, worldRepository);
    return new EditWorldController(logger, editWorldUseCase);
}

export function createLocationController (): ICreateLocationController {
    const locationRepository = new LocationRepository(logger, storage);
    const createLocationService = new CreateLocationService(logger, idGenerate);
    const createLocationUseCase = new CreateLocationUseCase(logger, locationRepository, createLocationService);
    return new CreateLocationController(logger, createLocationUseCase);
}

export function getLocationsController (): IGetLocationsController {
    const locationRepository = new LocationRepository(logger, storage);
    const getLocationsUseCase = new GetLocationsUseCase(logger, locationRepository);
    return new GetLocationsController(logger, getLocationsUseCase);
}

export function createItemController (): ICreateItemController {
    const itemRepository = new ItemRepository(logger, storage);
    const createItemService = new CreateItemService(logger, idGenerate);
    const createItemUseCase = new CreateItemUseCase(logger, itemRepository, createItemService);
    return new CreateItemController(logger, createItemUseCase);
}

export function getItemsController (): IGetItemsController {
    const itemRepository = new ItemRepository(logger, storage);
    const getItemsUseCase = new GetItemsUseCase(logger, itemRepository);
    return new GetItemsController(logger, getItemsUseCase);
}

export function createAdventureController (): ICreateAdventureController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const createAdventureService = new CreateAdventureService(logger, idGenerate);
    const createAdventureUseCase = new CreateAdventureUseCase(logger, createAdventureService, adventureRepository);
    return new CreateAdventureController(logger, createAdventureUseCase);
}

export function editAdventureController (): IEditAdventureController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const editAdventureService = new EditAdventureService(logger);
    const editAdventureUseCase = new EditAdventureUseCase(logger, editAdventureService, adventureRepository);
    return new EditAdventureController(logger, editAdventureUseCase);
}

export function getAdventuresController (): IGetAdventuresController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const getAdventuresUseCase = new GetAdventureUseCase(logger, adventureRepository);
    return new GetAdventuresController(logger, getAdventuresUseCase);
}

export function appendAdventureChatController (): IAdventureAppendChatController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const adventureAppendChatService = new AdventureAppendChatService(logger);
    const adventureAppendChatUseCase = new AdventureAppendChatUseCase(logger, adventureRepository, adventureAppendChatService);
    return new AdventureAppendChatController(logger, adventureAppendChatUseCase);
}

export function createChatAdventureController (): ICreateChatAdventureController {
    const createChatService = new CreateChatService(logger, idGenerate);
    const createChatAdventureUseCase = new CreateChatAdventureUseCase(logger, createChatService);
    return new CreateChatAdventureController(logger, createChatAdventureUseCase);
}

export function eraseAdventuresController (): IEraseAdventuresController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const eraseAdventuresUseCase = new EraseAdventuresUseCase(logger, adventureRepository);
    return new EraseAdventuresController(logger, eraseAdventuresUseCase);
}

export function eraseAdventureController (): IEraseAdventureController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const eraseAdventureUseCase = new EraseAdventureUseCase(logger, adventureRepository);
    return new EraseAdventureController(logger, eraseAdventureUseCase);
}

export function getAdventureTextController (): IGetAdventureTextController {
    const textGeneration = new TextGeneration(logger);
    const llamaCppGateway = new LlamaCppGateway(logger, getStreamProvider());
    const getAdventureTextUseCase = new GetAdventureTextUseCase(logger, textGeneration, llamaCppGateway);
    return new GetAdventureTextController(logger, getAdventureTextUseCase);
}

export function eraseConnectionController (): IEraseConnectionController {
    const connectionRepository = new ConnectionRepository(logger, storage);
    const eraseConnectionUseCase = new EraseConnectionUseCase(logger, connectionRepository);
    return new EraseConnectionController(logger, eraseConnectionUseCase);
}

export function editConnectionController (): IEditConnectionController {
    const editConnectionConfigService = new EditConnectionConfigService(logger);
    const connectionRepository = new ConnectionRepository(logger, storage);
    const editConnectionUseCase = new EditConnectionUseCase(logger, editConnectionConfigService, connectionRepository);
    return new EditConnectionController(logger, editConnectionUseCase);
}
