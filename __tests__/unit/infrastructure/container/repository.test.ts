import * as factories from '@infra/container/repository';
import * as repositories from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';

const logger = {} as ILogger;
const storage = {} as IStorage;

describe('repository factories', () => {
    it('createAbilityRepository builds a AbilityRepository', () => {
        expect(factories.createAbilityRepository(storage, logger)).toBeInstanceOf(repositories.AbilityRepository);
    });

    it('createAdventureRepository builds a AdventureRepository', () => {
        expect(factories.createAdventureRepository(storage, logger)).toBeInstanceOf(repositories.AdventureRepository);
    });

    it('createAssistantRepository builds a AssistantRepository', () => {
        expect(factories.createAssistantRepository(storage, logger)).toBeInstanceOf(repositories.AssistantRepository);
    });

    it('createCharacterRepository builds a CharacterRepository', () => {
        expect(factories.createCharacterRepository(storage, logger)).toBeInstanceOf(repositories.CharacterRepository);
    });

    it('createConnectionRepository builds a ConnectionRepository', () => {
        expect(factories.createConnectionRepository(storage, logger)).toBeInstanceOf(repositories.ConnectionRepository);
    });

    it('createItemRepository builds a ItemRepository', () => {
        expect(factories.createItemRepository(storage, logger)).toBeInstanceOf(repositories.ItemRepository);
    });

    it('createLocationRepository builds a LocationRepository', () => {
        expect(factories.createLocationRepository(storage, logger)).toBeInstanceOf(repositories.LocationRepository);
    });

    it('createProficiencyRepository builds a ProficiencyRepository', () => {
        expect(factories.createProficiencyRepository(storage, logger)).toBeInstanceOf(repositories.ProficiencyRepository);
    });

    it('createSamplerRepository builds a SamplerRepository', () => {
        expect(factories.createSamplerRepository(storage, logger)).toBeInstanceOf(repositories.SamplerRepository);
    });

    it('createStatusRepository builds a StatusRepository', () => {
        expect(factories.createStatusRepository(storage, logger)).toBeInstanceOf(repositories.StatusRepository);
    });

    it('createSystemPromptRepository builds a SystemPromptRepository', () => {
        expect(factories.createSystemPromptRepository(storage, logger)).toBeInstanceOf(repositories.SystemPromptRepository);
    });

    it('createModelTemplateRepository builds a ModelTemplateRepository', () => {
        expect(factories.createModelTemplateRepository(storage, logger)).toBeInstanceOf(repositories.ModelTemplateRepository);
    });

    it('createWorldRepository builds a WorldRepository', () => {
        expect(factories.createWorldRepository(storage, logger)).toBeInstanceOf(repositories.WorldRepository);
    });

    it('createWorldMasterRepository builds a WorldMasterRepository', () => {
        expect(factories.createWorldMasterRepository(storage, logger)).toBeInstanceOf(repositories.WorldMasterRepository);
    });

    it('createDraftRepository builds a DraftRepository', () => {
        expect(factories.createDraftRepository(storage, logger)).toBeInstanceOf(repositories.DraftRepository);
    });

    it('createSettingsRepository builds a SettingsRepository', () => {
        expect(factories.createSettingsRepository(storage, logger)).toBeInstanceOf(repositories.SettingsRepository);
    });
});
