import {
    CreateAdventureController,
    CreateConnectionConfigController,
    GetConnectionsController,
    GetModelsController,
    ICreateAdventureController,
    ICreateConnectionConfigController,
    IGetConnectionsController,
    IGetModelsController
} from "../adapters/controllers";
import {
    CreateAdventureUseCase,
    CreateConnectionConfigUseCase,
    GetConnectionsUseCase,
    GetModelsUseCase,
} from "../application/use-cases";
import {
    CreateAdventureService,
    CreateConnectionConfigService
} from "../domain/services";
import {
    ConnectionRepository
} from "./repository";
import { Logger } from "./logger";
import { UUIDGenerator } from "./providers";
import { MobileStorage } from "./storage/mobileStorage";
import { LlamaCppGateway } from "./http/llama-cpp";

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

