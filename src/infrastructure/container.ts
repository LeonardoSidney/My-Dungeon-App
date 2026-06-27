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
    GetProficienciesController
} from "../adapters/controllers";
import {
    CreateAbilityService,
    CreateAdventureService,
    CreateAssistantService,
    CreateConnectionConfigService,
    CreateSamplerService,
    GetSamplersService,
    CreateStatusService,
    CreateProficiencyService
} from "../application/services";
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
    GetProficienciesUseCase
} from "../application/use-cases";
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
    IGetProficienciesController
} from "../domain/controllers";
import { LlamaCppGateway } from "./http/llama-cpp";
import { Logger } from "./logger";
import { UUIDGenerator } from "./providers";
import {
    AbilityRepository,
    AssistantRepository,
    ConnectionRepository,
    SamplerRepository,
    StatusRepository,
    ProficiencyRepository
} from "./repository";
import { MobileStorage } from "./storage";

const logger = new Logger();
const idGenerate = new UUIDGenerator();
const storage = new MobileStorage(logger);

export function createAdventureController(): ICreateAdventureController {
    const createAdventureService = new CreateAdventureService(logger, idGenerate);
    const createAdventureUseCase = new CreateAdventureUseCase(logger, createAdventureService);
    return new CreateAdventureController(logger, createAdventureUseCase);
}

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
