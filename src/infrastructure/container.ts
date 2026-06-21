import { CreateAdventureController, CreateConnectionConfigController, ICreateAdventureController, ICreateConnectionConfigController } from "../adapters/controllers";
import { CreateAdventureUseCase, CreateConnectionConfigUseCase } from "../application/use-cases";
import { CreateAdventureService, CreateConnectionConfigService } from "../domain/services";
import { CreateConnectionConfigRepository } from "./repository";
import { Logger } from "./logger";
import { UUIDGenerator } from "./providers";
import { MobileStorage } from "./storage/mobileStorage";


export function createAdventureController(): ICreateAdventureController {
    const logger = new Logger();
    const idGenerate = new UUIDGenerator();
    const createAdventureService = new CreateAdventureService(logger, idGenerate);
    const createAdventureUseCase = new CreateAdventureUseCase(logger, createAdventureService);
    return new CreateAdventureController(logger, createAdventureUseCase);
}

export function createConnectionConfigController(): ICreateConnectionConfigController {
    const logger = new Logger();
    const idGenerate = new UUIDGenerator();
    const createConnectionConfigService = new CreateConnectionConfigService(logger, idGenerate);
    const storage = new MobileStorage(logger);
    const createConnectionRepository = new CreateConnectionConfigRepository(logger, storage);
    const createConnectionConfigUseCase = new CreateConnectionConfigUseCase(logger, createConnectionConfigService, createConnectionRepository);
    return new CreateConnectionConfigController(logger, createConnectionConfigUseCase);
}
