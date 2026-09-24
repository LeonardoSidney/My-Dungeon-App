import {
    AbilityRepository,
    AdventureRepository,
    AssistantRepository,
    CharacterRepository,
    ConnectionRepository,
    ItemRepository,
    LocationRepository,
    ProficiencyRepository,
    SamplerRepository,
    StatusRepository,
    SystemPromptRepository,
    ModelTemplateRepository,
    WorldRepository,
    WorldMasterRepository,
} from '../repository';
import {
    IAbilityRepository,
    IModelTemplateRepository,
    IAdventureRepository,
    IAssistantRepository,
    ICharacterRepository,
    IConnectionRepository,
    IItemRepository,
    ILocationRepository,
    IProficiencyRepository,
    ISamplerRepository,
    IStatusRepository,
    ISystemPromptRepository,
    IWorldRepository,
    IWorldMasterRepository,
} from '@domain/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';

export function createAbilityRepository (storage: IStorage, logger: ILogger): IAbilityRepository {
    return new AbilityRepository(logger, storage);
}

export function createAdventureRepository (storage: IStorage, logger: ILogger): IAdventureRepository {
    return new AdventureRepository(logger, storage);
}

export function createAssistantRepository (storage: IStorage, logger: ILogger): IAssistantRepository {
    return new AssistantRepository(logger, storage);
}

export function createCharacterRepository (storage: IStorage, logger: ILogger): ICharacterRepository {
    return new CharacterRepository(logger, storage);
}

export function createConnectionRepository (storage: IStorage, logger: ILogger): IConnectionRepository {
    return new ConnectionRepository(logger, storage);
}

export function createItemRepository (storage: IStorage, logger: ILogger): IItemRepository {
    return new ItemRepository(logger, storage);
}

export function createLocationRepository (storage: IStorage, logger: ILogger): ILocationRepository {
    return new LocationRepository(logger, storage);
}

export function createProficiencyRepository (storage: IStorage, logger: ILogger): IProficiencyRepository {
    return new ProficiencyRepository(logger, storage);
}

export function createSamplerRepository (storage: IStorage, logger: ILogger): ISamplerRepository {
    return new SamplerRepository(logger, storage);
}

export function createStatusRepository (storage: IStorage, logger: ILogger): IStatusRepository {
    return new StatusRepository(logger, storage);
}

export function createSystemPromptRepository (storage: IStorage, logger: ILogger): ISystemPromptRepository {
    return new SystemPromptRepository(logger, storage);
}

export function createModelTemplateRepository (storage: IStorage, logger: ILogger): IModelTemplateRepository {
    return new ModelTemplateRepository(logger, storage);
}

export function createWorldRepository (storage: IStorage, logger: ILogger): IWorldRepository {
    return new WorldRepository(logger, storage);
}

export function createWorldMasterRepository (storage: IStorage, logger: ILogger): IWorldMasterRepository {
    return new WorldMasterRepository(logger, storage);
}
