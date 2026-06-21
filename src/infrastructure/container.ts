import { CreateAdventureController, CreateConnectionConfigController, GetConnectionsController, ICreateAdventureController, ICreateConnectionConfigController, IGetConnectionsController } from "../adapters/controllers";
import { CreateAdventureUseCase, CreateConnectionConfigUseCase, GetConnectionsUseCase } from "../application/use-cases";
import { CreateAdventureService, CreateConnectionConfigService } from "../domain/services";
import { CreateConnectionConfigRepository, GetConnectionsRepository } from "./repository";
import { Logger } from "./logger";
import { UUIDGenerator } from "./providers";
import { MobileStorage } from "./storage/mobileStorage";

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
    const createConnectionRepository = new CreateConnectionConfigRepository(logger, storage);
    const createConnectionConfigUseCase = new CreateConnectionConfigUseCase(logger, createConnectionConfigService, createConnectionRepository);
    return new CreateConnectionConfigController(logger, createConnectionConfigUseCase);
}

export function getConnectionsController(): IGetConnectionsController {
    const getConnectionsRepository = new GetConnectionsRepository(logger, storage);
    const getConnectionsUseCase = new GetConnectionsUseCase(logger, getConnectionsRepository);
    return new GetConnectionsController(logger, getConnectionsUseCase);
}
