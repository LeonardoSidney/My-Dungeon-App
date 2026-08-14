import { Logger } from '../logger';
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
    WorldRepository,
    WorldMasterRepository,
} from '../repository';
import { MobileStorage } from '../storage';
import {
    IAbilityRepository,
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

export function createAbilityRepository (storage: MobileStorage, logger: Logger): IAbilityRepository {
    return new AbilityRepository(logger, storage);
}

export function createAdventureRepository (storage: MobileStorage, logger: Logger): IAdventureRepository {
    return new AdventureRepository(logger, storage);
}

export function createAssistantRepository (storage: MobileStorage, logger: Logger): IAssistantRepository {
    return new AssistantRepository(logger, storage);
}

export function createCharacterRepository (storage: MobileStorage, logger: Logger): ICharacterRepository {
    return new CharacterRepository(logger, storage);
}

export function createConnectionRepository (storage: MobileStorage, logger: Logger): IConnectionRepository {
    return new ConnectionRepository(logger, storage);
}

export function createItemRepository (storage: MobileStorage, logger: Logger): IItemRepository {
    return new ItemRepository(logger, storage);
}

export function createLocationRepository (storage: MobileStorage, logger: Logger): ILocationRepository {
    return new LocationRepository(logger, storage);
}

export function createProficiencyRepository (storage: MobileStorage, logger: Logger): IProficiencyRepository {
    return new ProficiencyRepository(logger, storage);
}

export function createSamplerRepository (storage: MobileStorage, logger: Logger): ISamplerRepository {
    return new SamplerRepository(logger, storage);
}

export function createStatusRepository (storage: MobileStorage, logger: Logger): IStatusRepository {
    return new StatusRepository(logger, storage);
}

export function createSystemPromptRepository (storage: MobileStorage, logger: Logger): ISystemPromptRepository {
    return new SystemPromptRepository(logger, storage);
}

export function createWorldRepository (storage: MobileStorage, logger: Logger): IWorldRepository {
    return new WorldRepository(logger, storage);
}

export function createWorldMasterRepository (storage: MobileStorage, logger: Logger): IWorldMasterRepository {
    return new WorldMasterRepository(logger, storage);
}
