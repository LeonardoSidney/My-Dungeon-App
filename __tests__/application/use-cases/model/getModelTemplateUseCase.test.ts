import { GetModelTemplateUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IHashProvider } from '@domain/providers';
import { IModelTemplateRepository } from '@domain/repository';
import { IGetModelTemplateService } from '@domain/services';
import { ModelTemplate } from '@domain/entities';
import { createConnectionHelper, createModelTemplateHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const TEMPLATE = 'jinja {{ messages }}';
const TEMPLATE_HASH = 'hash-of-template';
const OTHER_TEMPLATE_HASH = 'hash-of-other-template';

function buildHashProvider (hash: string = TEMPLATE_HASH): IHashProvider {
    return {
        md5: jest.fn().mockImplementation((value: string) => (value === TEMPLATE ? hash : 'other-hash'))
    };
}

function buildDependencies (
    cached: ModelTemplate | undefined,
    fetchResponse: { success: boolean; template?: string; error?: string; },
    hashProvider: IHashProvider
): {
    useCase: GetModelTemplateUseCase;
    repository: IModelTemplateRepository;
    service: IGetModelTemplateService;
} {
    const repository: IModelTemplateRepository = {
        getModelTemplate: jest.fn().mockResolvedValue(cached),
        saveModelTemplate: jest.fn().mockResolvedValue(true)
    };

    const builtTemplate: ModelTemplate = {
        id: 'new-id',
        modelId: 'model-a',
        connection: 'localhost:8080',
        template: TEMPLATE,
        hash: TEMPLATE_HASH,
        editedByUser: false,
        createdAt: cached ? cached.createdAt : new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01')
    };

    const service: IGetModelTemplateService = {
        fetchModelTemplate: jest.fn().mockResolvedValue(fetchResponse),
        buildModelTemplate: jest.fn().mockReturnValue(builtTemplate)
    };

    const useCase = new GetModelTemplateUseCase(mockLogger, repository, service, hashProvider);

    return { useCase, repository, service };
}

describe('GetModelTemplateUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validation', () => {
        it('throws when modelId is empty', async () => {
            const { useCase } = buildDependencies(undefined, { success: true, template: TEMPLATE }, buildHashProvider());

            await expect(
                useCase.execute({ connection: createConnectionHelper(), modelId: '  ' })
            ).rejects.toThrow('A modelId is required to get the model template');
        });

        it('throws when the connection has no ip', async () => {
            const { useCase } = buildDependencies(undefined, { success: true, template: TEMPLATE }, buildHashProvider());

            await expect(
                useCase.execute({ connection: createConnectionHelper({ ip: '' }), modelId: 'model-a' })
            ).rejects.toThrow('A connection with a valid ip is required to get the model template');
        });
    });

    describe('without cache', () => {
        it('saves and returns a new template when the fetch succeeds', async () => {
            const { useCase, repository, service } = buildDependencies(undefined, { success: true, template: TEMPLATE }, buildHashProvider());

            const result = await useCase.execute({ connection: createConnectionHelper(), modelId: 'model-a' });

            expect(result.success).toBe(true);
            expect(result.modelTemplate).toMatchObject({
                id: 'new-id',
                modelId: 'model-a',
                connection: 'localhost:8080',
                template: TEMPLATE,
                hash: TEMPLATE_HASH,
                editedByUser: false
            });
            expect(service.fetchModelTemplate).toHaveBeenCalledWith({ connection: expect.anything(), modelId: 'model-a' });
            expect(repository.saveModelTemplate).toHaveBeenCalledWith({ modelTemplate: expect.objectContaining({ id: 'new-id' }) });
        });

        it('returns the fetch error without saving when the fetch fails', async () => {
            const { useCase, repository } = buildDependencies(undefined, { success: false, error: 'model is not loaded' }, buildHashProvider());

            const result = await useCase.execute({ connection: createConnectionHelper(), modelId: 'model-a' });

            expect(result).toEqual({ success: false, error: 'model is not loaded' });
            expect(repository.saveModelTemplate).not.toHaveBeenCalled();
        });
    });

    describe('with editedByUser cache', () => {
        it('serves the cache without calling the provider or hashing', async () => {
            const cached = createModelTemplateHelper({ editedByUser: true, template: 'edited template', hash: 'stale-hash' });
            const hashProvider = buildHashProvider();
            const { useCase, repository, service } = buildDependencies(cached, { success: true, template: TEMPLATE }, hashProvider);

            const result = await useCase.execute({ connection: createConnectionHelper(), modelId: 'model-a' });

            expect(result.success).toBe(true);
            expect(result.modelTemplate).toBe(cached);
            expect(service.fetchModelTemplate).not.toHaveBeenCalled();
            expect(hashProvider.md5).not.toHaveBeenCalled();
            expect(repository.saveModelTemplate).not.toHaveBeenCalled();
        });
    });

    describe('with unedited cache', () => {
        it('serves the cache when the hash matches', async () => {
            const cached = createModelTemplateHelper({ hash: TEMPLATE_HASH });
            const { useCase, repository } = buildDependencies(cached, { success: true, template: TEMPLATE }, buildHashProvider());

            const result = await useCase.execute({ connection: createConnectionHelper(), modelId: 'model-a' });

            expect(result.success).toBe(true);
            expect(result.modelTemplate).toBe(cached);
            expect(repository.saveModelTemplate).not.toHaveBeenCalled();
        });

        it('saves and returns a new template when the hash differs', async () => {
            const cached = createModelTemplateHelper({ hash: OTHER_TEMPLATE_HASH, createdAt: new Date('2020-01-01') });
            const { useCase, repository } = buildDependencies(cached, { success: true, template: TEMPLATE }, buildHashProvider());

            const result = await useCase.execute({ connection: createConnectionHelper(), modelId: 'model-a' });

            expect(result.success).toBe(true);
            expect(result.modelTemplate?.id).toBe('new-id');
            expect(result.modelTemplate?.hash).toBe(TEMPLATE_HASH);
            expect(result.modelTemplate?.createdAt).toEqual(cached.createdAt);
            expect(result.modelTemplate?.template).toBe(TEMPLATE);
            expect(repository.saveModelTemplate).toHaveBeenCalledWith({ modelTemplate: expect.objectContaining({ id: 'new-id' }) });
        });

        it('treats a missing hash as outdated and saves a new template', async () => {
            const cached = createModelTemplateHelper({ hash: undefined });
            const { useCase, repository } = buildDependencies(cached, { success: true, template: TEMPLATE }, buildHashProvider());

            const result = await useCase.execute({ connection: createConnectionHelper(), modelId: 'model-a' });

            expect(result.success).toBe(true);
            expect(result.modelTemplate?.id).toBe('new-id');
            expect(result.modelTemplate?.hash).toBe(TEMPLATE_HASH);
            expect(repository.saveModelTemplate).toHaveBeenCalled();
        });

        it('serves the cache when the provider fails', async () => {
            const cached = createModelTemplateHelper({ hash: TEMPLATE_HASH });
            const { useCase, repository } = buildDependencies(cached, { success: false, error: 'model is not loaded' }, buildHashProvider());

            const result = await useCase.execute({ connection: createConnectionHelper(), modelId: 'model-a' });

            expect(result.success).toBe(true);
            expect(result.modelTemplate).toBe(cached);
            expect(repository.saveModelTemplate).not.toHaveBeenCalled();
        });
    });

    describe('connection key', () => {
        it('uses ip and port as the connection key', async () => {
            const { useCase, repository } = buildDependencies(undefined, { success: true, template: TEMPLATE }, buildHashProvider());

            await useCase.execute({ connection: createConnectionHelper({ ip: '10.0.0.1', port: 8080 }), modelId: 'model-a' });

            expect(repository.getModelTemplate).toHaveBeenCalledWith({ modelId: 'model-a', connection: '10.0.0.1:8080' });
        });

        it('uses only the ip when there is no port', async () => {
            const { useCase, repository } = buildDependencies(undefined, { success: true, template: TEMPLATE }, buildHashProvider());

            await useCase.execute({ connection: createConnectionHelper({ ip: '10.0.0.1', port: undefined }), modelId: 'model-a' });

            expect(repository.getModelTemplate).toHaveBeenCalledWith({ modelId: 'model-a', connection: '10.0.0.1' });
        });
    });
});
