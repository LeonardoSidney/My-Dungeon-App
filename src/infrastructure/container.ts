import {
    CreateAbilityController,
    CreateAdventureController,
    CreateAssistantController,
    CreateConnectionConfigController,
    CreateSamplerController,
    GetAbilitiesController,
    GetAssistantsController,
    GetConnectionsController,
    GetModelsFromProviderController,
    GetSamplersController,
    CreateStatusController,
    GetStatusesController,
    CreateProficiencyController,
    GetProficienciesController,
    CreateCharacterController,
    GetCharactersController,
    CreateWorldMasterController,
    GetWorldMastersController,
    CreateWorldController,
    GetWorldsController,
    CreateLocationController,
    GetLocationsController,
    CreateItemController,
    GetItemsController,
    CreateSystemPromptController,
    GetSystemPromptsController,
    GetAdventuresController,
    AdventureAppendChatController,
    EraseAdventuresController
} from '../adapters/controllers';
import {
    CreateAbilityService,
    CreateAdventureService,
    CreateAssistantService,
    CreateConnectionConfigService,
    CreateSamplerService,
    GetSamplersService,
    CreateStatusService,
    CreateProficiencyService,
    CreateCharacterService,
    CreateWorldMasterService,
    CreateWorldService,
    CreateLocationService,
    CreateItemService,
    CreateSystemPromptService,
    AdventureAppendChatService
} from '../application/services';
import {
    CreateAbilityUseCase,
    CreateAdventureUseCase,
    CreateAssistantUseCase,
    CreateConnectionConfigUseCase,
    CreateSamplerUseCase,
    GetAbilitiesUseCase,
    GetAssistantsUseCase,
    GetConnectionsUseCase,
    GetModelsFromProviderUseCase,
    GetSamplersUseCase,
    CreateStatusUseCase,
    GetStatusesUseCase,
    CreateProficiencyUseCase,
    GetProficienciesUseCase,
    CreateCharacterUseCase,
    GetCharactersUseCase,
    CreateWorldMasterUseCase,
    GetWorldMastersUseCase,
    CreateWorldUseCase,
    GetWorldsUseCase,
    CreateLocationUseCase,
    GetLocationsUseCase,
    CreateItemUseCase,
    GetItemsUseCase,
    CreateSystemPromptUseCase,
    GetSystemPromptsUseCase,
    GetAdventureUseCase,
    AdventureAppendChatUseCase,
    EraseAdventuresUseCase
} from '../application/use-cases';
import {
    ICreateAbilityController,
    ICreateAdventureController,
    ICreateAssistantController,
    ICreateConnectionConfigController,
    ICreateSamplerController,
    IGetAbilitiesController,
    IGetAssistantsController,
    IGetConnectionsController,
    IGetModelsFromProviderController,
    IGetSamplersController,
    ICreateStatusController,
    IGetStatusesController,
    ICreateProficiencyController,
    IGetProficienciesController,
    ICreateCharacterController,
    IGetCharactersController,
    ICreateWorldMasterController,
    IGetWorldMastersController,
    ICreateWorldController,
    IGetWorldsController,
    ICreateLocationController,
    IGetLocationsController,
    ICreateItemController,
    IGetItemsController,
    ICreateSystemPromptController,
    IGetSystemPromptsController,
    IGetAdventuresController,
    IAdventureAppendChatController,
    IEraseAdventuresController
} from '@domain/controllers';
import { LlamaCppGateway } from './http/llama-cpp';
import { Logger } from './logger';
import { UUIDGenerator } from './providers';
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

const logger = new Logger();
const idGenerate = new UUIDGenerator();
const storage = new MobileStorage(logger);

export function createConnectionConfigController(): ICreateConnectionConfigController {
    const createConnectionConfigService = new CreateConnectionConfigService(logger, idGenerate);
    const connectionRepository = new ConnectionRepository(logger, storage);
    const createConnectionConfigUseCase = new CreateConnectionConfigUseCase(logger, createConnectionConfigService, connectionRepository);
    return new CreateConnectionConfigController(logger, createConnectionConfigUseCase);
}

export function getConnectionsController(): IGetConnectionsController {
    const connectionRepository = new ConnectionRepository(logger, storage);
    const getConnectionsUseCase = new GetConnectionsUseCase(logger, connectionRepository);
    return new GetConnectionsController(logger, getConnectionsUseCase);
}

export function getModelsFromProviderController(): IGetModelsFromProviderController {
    const llamaCppGateway = new LlamaCppGateway(logger);
    const getModelsUseCase = new GetModelsFromProviderUseCase(logger, llamaCppGateway);
    return new GetModelsFromProviderController(logger, getModelsUseCase);
}

export function createSamplerController(): ICreateSamplerController {
    const createSamplerService = new CreateSamplerService(logger, idGenerate);
    const samplerRepository = new SamplerRepository(logger, storage);
    const createSamplerUseCase = new CreateSamplerUseCase(logger, samplerRepository, createSamplerService);
    return new CreateSamplerController(logger, createSamplerUseCase);
}

export function getSamplersController(): IGetSamplersController {
    const samplerRepository = new SamplerRepository(logger, storage);
    const getSamplersService = new GetSamplersService(logger);
    const getSamplersUseCase = new GetSamplersUseCase(logger, getSamplersService, samplerRepository);
    return new GetSamplersController(logger, getSamplersUseCase);
}

export function createAssistantController(): ICreateAssistantController {
    const createAssistantService = new CreateAssistantService(logger, idGenerate);
    const assistantRepository = new AssistantRepository(logger, storage);
    const createAssistantUseCase = new CreateAssistantUseCase(logger, assistantRepository, createAssistantService);
    return new CreateAssistantController(logger, createAssistantUseCase);
}

export function getAssistantsController(): IGetAssistantsController {
    const assistantRepository = new AssistantRepository(logger, storage);
    const getAssistantsUseCase = new GetAssistantsUseCase(logger, assistantRepository);
    return new GetAssistantsController(logger, getAssistantsUseCase);
}

export function createAbilityController(): ICreateAbilityController {
    const createAbilityService = new CreateAbilityService(logger, idGenerate);
    const abilityRepository = new AbilityRepository(logger, storage);
    const createAbilityUseCase = new CreateAbilityUseCase(logger, createAbilityService, abilityRepository);
    return new CreateAbilityController(logger, createAbilityUseCase);
}

export function getAbilitiesController(): IGetAbilitiesController {
    const abilityRepository = new AbilityRepository(logger, storage);
    const getAbilitiesUseCase = new GetAbilitiesUseCase(logger, abilityRepository);
    return new GetAbilitiesController(logger, getAbilitiesUseCase);
}

export function createStatusController(): ICreateStatusController {
    const createStatusService = new CreateStatusService(logger, idGenerate);
    const statusRepository = new StatusRepository(logger, storage);
    const createStatusUseCase = new CreateStatusUseCase(logger, createStatusService, statusRepository);
    return new CreateStatusController(logger, createStatusUseCase);
}

export function getStatusesController(): IGetStatusesController {
    const statusRepository = new StatusRepository(logger, storage);
    const getStatusesUseCase = new GetStatusesUseCase(logger, statusRepository);
    return new GetStatusesController(logger, getStatusesUseCase);
}

export function createProficiencyController(): ICreateProficiencyController {
    const createProficiencyService = new CreateProficiencyService(logger, idGenerate);
    const proficiencyRepository = new ProficiencyRepository(logger, storage);
    const createProficiencyUseCase = new CreateProficiencyUseCase(logger, createProficiencyService, proficiencyRepository);
    return new CreateProficiencyController(logger, createProficiencyUseCase);
}

export function getProficienciesController(): IGetProficienciesController {
    const proficiencyRepository = new ProficiencyRepository(logger, storage);
    const getProficienciesUseCase = new GetProficienciesUseCase(logger, proficiencyRepository);
    return new GetProficienciesController(logger, getProficienciesUseCase);
}

export function createCharacterController(): ICreateCharacterController {
    const characterRepository = new CharacterRepository(logger, storage);
    const createCharacterService = new CreateCharacterService(logger, idGenerate);
    const createCharacterUseCase = new CreateCharacterUseCase(logger, characterRepository, createCharacterService);
    return new CreateCharacterController(logger, createCharacterUseCase);
}

export function getCharactersController(): IGetCharactersController {
    const characterRepository = new CharacterRepository(logger, storage);
    const getCharactersUseCase = new GetCharactersUseCase(logger, characterRepository);
    return new GetCharactersController(logger, getCharactersUseCase);
}

export function createWorldMasterController(): ICreateWorldMasterController {
    const worldMasterRepository = new WorldMasterRepository(logger, storage);
    const createWorldMasterService = new CreateWorldMasterService(logger, idGenerate);
    const createWorldMasterUseCase = new CreateWorldMasterUseCase(logger, worldMasterRepository, createWorldMasterService);
    return new CreateWorldMasterController(logger, createWorldMasterUseCase);
}

export function getWorldMasterController(): IGetWorldMastersController {
    const worldMasterRepository = new WorldMasterRepository(logger, storage);
    const getWorldMasterUseCase = new GetWorldMastersUseCase(logger, worldMasterRepository);
    return new GetWorldMastersController(logger, getWorldMasterUseCase);
}

export function createSystemPromptController(): ICreateSystemPromptController {
    const systemPromptRepository = new SystemPromptRepository(logger, storage);
    const createSystemPromptService = new CreateSystemPromptService(logger, idGenerate);
    const createSystemPromptUseCase = new CreateSystemPromptUseCase(logger, systemPromptRepository, createSystemPromptService);
    return new CreateSystemPromptController(logger, createSystemPromptUseCase);
}

export function getSystemPromptsController(): IGetSystemPromptsController {
    const systemPromptRepository = new SystemPromptRepository(logger, storage);
    const getSystemPromptsUseCase = new GetSystemPromptsUseCase(logger, systemPromptRepository);
    return new GetSystemPromptsController(logger, getSystemPromptsUseCase);
}

export function createWorldController(): ICreateWorldController {
    const worldRepository = new WorldRepository(logger, storage);
    const createWorldService = new CreateWorldService(logger, idGenerate);
    const createWorldUseCase = new CreateWorldUseCase(logger, worldRepository, createWorldService);
    return new CreateWorldController(logger, createWorldUseCase);
}

export function getWorldsController(): IGetWorldsController {
    const worldRepository = new WorldRepository(logger, storage);
    const getWorldsUseCase = new GetWorldsUseCase(logger, worldRepository);
    return new GetWorldsController(logger, getWorldsUseCase);
}

export function createLocationController(): ICreateLocationController {
    const locationRepository = new LocationRepository(logger, storage);
    const createLocationService = new CreateLocationService(logger, idGenerate);
    const createLocationUseCase = new CreateLocationUseCase(logger, locationRepository, createLocationService);
    return new CreateLocationController(logger, createLocationUseCase);
}

export function getLocationsController(): IGetLocationsController {
    const locationRepository = new LocationRepository(logger, storage);
    const getLocationsUseCase = new GetLocationsUseCase(logger, locationRepository);
    return new GetLocationsController(logger, getLocationsUseCase);
}

export function createItemController(): ICreateItemController {
    const itemRepository = new ItemRepository(logger, storage);
    const createItemService = new CreateItemService(logger, idGenerate);
    const createItemUseCase = new CreateItemUseCase(logger, itemRepository, createItemService);
    return new CreateItemController(logger, createItemUseCase);
}

export function getItemsController(): IGetItemsController {
    const itemRepository = new ItemRepository(logger, storage);
    const getItemsUseCase = new GetItemsUseCase(logger, itemRepository);
    return new GetItemsController(logger, getItemsUseCase);
}

export function createAdventureController(): ICreateAdventureController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const createAdventureService = new CreateAdventureService(logger, idGenerate);
    const createAdventureUseCase = new CreateAdventureUseCase(logger, createAdventureService, adventureRepository);
    return new CreateAdventureController(logger, createAdventureUseCase);
}

export function getAdventuresController(): IGetAdventuresController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const getAdventuresUseCase = new GetAdventureUseCase(logger, adventureRepository);
    return new GetAdventuresController(logger, getAdventuresUseCase);
}

export function appendAdventureChatController(): IAdventureAppendChatController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const adventureAppendChatService = new AdventureAppendChatService(logger);
    const adventureAppendChatUseCase = new AdventureAppendChatUseCase(logger, adventureRepository, adventureAppendChatService);
    return new AdventureAppendChatController(logger, adventureAppendChatUseCase);
}

export function eraseAdventuresController(): IEraseAdventuresController {
    const adventureRepository = new AdventureRepository(logger, storage);
    const eraseAdventuresUseCase = new EraseAdventuresUseCase(logger, adventureRepository);
    return new EraseAdventuresController(logger, eraseAdventuresUseCase);
}
