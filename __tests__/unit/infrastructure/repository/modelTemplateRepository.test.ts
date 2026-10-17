import { ModelTemplateRepository } from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import { ModelTemplate } from '@domain/entities';
import { createModelTemplateHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function createStorage (stored: unknown): IStorage {
    return {
        load: jest.fn().mockResolvedValue(stored),
        save: jest.fn().mockResolvedValue(undefined)
    };
}

function buildRepository (stored: unknown): { repository: ModelTemplateRepository; storage: IStorage; } {
    const storage = createStorage(stored);
    return { repository: new ModelTemplateRepository(mockLogger, storage), storage };
}

describe('ModelTemplateRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getModelTemplate', () => {
        it('returns the template matching modelId and connection', async () => {
            const stored = [
                createModelTemplateHelper({ modelId: 'model-a', connection: '10.0.0.1:8080' }),
                createModelTemplateHelper({ modelId: 'model-b', connection: '10.0.0.1:8080' })
            ];
            const { repository } = buildRepository(stored);

            const template = await repository.getModelTemplate({ modelId: 'model-a', connection: '10.0.0.1:8080' });

            expect(template?.modelId).toBe('model-a');
        });

        it('returns undefined when the modelId matches but the connection differs', async () => {
            const stored = [createModelTemplateHelper({ modelId: 'model-a', connection: '10.0.0.1:8080' })];
            const { repository } = buildRepository(stored);

            const template = await repository.getModelTemplate({ modelId: 'model-a', connection: '10.0.0.2:8080' });

            expect(template).toBeUndefined();
        });

        it('returns undefined for an empty storage', async () => {
            const { repository } = buildRepository(null);

            const template = await repository.getModelTemplate({ modelId: 'model-a', connection: '10.0.0.1:8080' });

            expect(template).toBeUndefined();
        });

        it('skips invalid stored entries', async () => {
            const stored = [
                { broken: true },
                createModelTemplateHelper({ modelId: 'model-a', connection: '10.0.0.1' })
            ];
            const { repository } = buildRepository(stored);

            const template = await repository.getModelTemplate({ modelId: 'model-a', connection: '10.0.0.1' });

            expect(template?.modelId).toBe('model-a');
            expect(mockLogger.warning).toHaveBeenCalled();
        });
    });

    describe('saveModelTemplate', () => {
        it('appends the template to an empty storage', async () => {
            const { repository, storage } = buildRepository(null);
            const modelTemplate: ModelTemplate = createModelTemplateHelper({ modelId: 'model-a', connection: '10.0.0.1' });

            const result = await repository.saveModelTemplate({ modelTemplate });

            expect(result).toBe(true);
            expect(storage.save).toHaveBeenCalledWith('@my_dungeon_app/model_template', [modelTemplate]);
        });

        it('appends the template to a storage without the same key', async () => {
            const other = createModelTemplateHelper({ modelId: 'model-b', connection: '10.0.0.1' });
            const { repository, storage } = buildRepository([other]);
            const modelTemplate: ModelTemplate = createModelTemplateHelper({ modelId: 'model-a', connection: '10.0.0.1' });

            await repository.saveModelTemplate({ modelTemplate });

            expect(storage.save).toHaveBeenCalledWith('@my_dungeon_app/model_template', [other, modelTemplate]);
        });

        it('replaces the existing entry with the same modelId and connection', async () => {
            const existing = createModelTemplateHelper({
                id: 'old-id',
                modelId: 'model-a',
                connection: '10.0.0.1:8080',
                template: 'old template'
            });
            const { repository, storage } = buildRepository([existing]);
            const replacement: ModelTemplate = createModelTemplateHelper({
                id: 'new-id',
                modelId: 'model-a',
                connection: '10.0.0.1:8080',
                template: 'new template'
            });

            await repository.saveModelTemplate({ modelTemplate: replacement });

            expect(storage.save).toHaveBeenCalledWith('@my_dungeon_app/model_template', [replacement]);
        });
    });
});
