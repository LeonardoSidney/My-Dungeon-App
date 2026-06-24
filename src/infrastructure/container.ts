import {
    CreateAdventureController,
    CreateAssistantController,
    CreateConnectionConfigController,
    CreateSamplerController,
    GetConnectionsController,
    GetModelsController,
    GetSamplersController
} from "../adapters/controllers";
import {
    CreateAdventureService,
    CreateAssistantService,
    CreateConnectionConfigService,
    CreateSamplerService,
    GetSamplersService
} from "../application/services";
import {
    CreateAdventureUseCase,
    CreateAssistantUseCase,
    CreateConnectionConfigUseCase,
    CreateSamplerUseCase,
    GetConnectionsUseCase,
    GetModelsUseCase,
    GetSamplersUseCase
} from "../application/use-cases";
import {
    ICreateAdventureController,
    ICreateAssistantController,
    ICreateConnectionConfigController,
    ICreateSamplerController,
    IGetConnectionsController,
    IGetModelsController,
    IGetSamplersController
} from "../domain/controllers";
import { LlamaCppGateway } from "./http/llama-cpp";
import { Logger } from "./logger";
import { UUIDGenerator } from "./providers";
import {
    AssistantRepository,
    ConnectionRepository,
    SamplerRepository
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

export function getModelsController(): IGetModelsController {
    const llamaCppGateway = new LlamaCppGateway(logger);
    const getModelsUseCase = new GetModelsUseCase(logger, llamaCppGateway);
    return new GetModelsController(logger, getModelsUseCase);
}

export function createSamplerController(): ICreateSamplerController {
    const createSamplerService = new CreateSamplerService(logger, idGenerate);
    const samplerRepository = new SamplerRepository(logger, storage);
    const createSamplerUseCase = new CreateSamplerUseCase(logger, samplerRepository, createSamplerService);
    return new CreateSamplerController(logger, createSamplerUseCase);
}

export function getSamplersController(): IGetSamplersController {
    const samplerRepository = new SamplerRepository(logger, storage);
    const getSamplersService = new GetSamplersService();
    const getSamplersUseCase = new GetSamplersUseCase(logger, getSamplersService, samplerRepository);
    return new GetSamplersController(logger, getSamplersUseCase);
}

export function createAssistantController(): ICreateAssistantController {
    const createAssistantService = new CreateAssistantService(logger, idGenerate);
    const assistantRepository = new AssistantRepository(logger, storage);
    const createAssistantUseCase = new CreateAssistantUseCase(logger, assistantRepository, createAssistantService);
    return new CreateAssistantController(logger, createAssistantUseCase);
}
