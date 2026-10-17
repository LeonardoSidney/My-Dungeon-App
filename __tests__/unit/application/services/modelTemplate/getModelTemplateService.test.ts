import { GetModelTemplateService } from '@application/services';
import { ILogger } from '@domain/logger';
import { IModelProviderGateway } from '@domain/gateways';
import { IHashProvider, IIdGenerator } from '@domain/providers';
import { createConnectionHelper, createModelTemplateHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function buildService (props: unknown): { service: GetModelTemplateService; idGenerator: IIdGenerator; hashProvider: IHashProvider; } {
    const mockGateway: IModelProviderGateway = {
        getModels: jest.fn(),
        getProps: jest.fn().mockResolvedValue(props),
        applyTemplate: jest.fn(),
        streamCompletion: jest.fn()
    };

    const idGenerator: IIdGenerator = { generate: jest.fn().mockReturnValue('new-id') };
    const hashProvider: IHashProvider = { md5: jest.fn().mockReturnValue('hash-of-template') };

    const service = new GetModelTemplateService(mockLogger, mockGateway, idGenerator, hashProvider);

    return { service, idGenerator, hashProvider };
}

describe('GetModelTemplateService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the template on a valid props response', async () => {
        const { service } = buildService({ chatTemplate: 'jinja {{ messages }}', modelAlias: 'model-a', isSleeping: false });

        const result = await service.fetchModelTemplate({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(result).toEqual({ success: true, template: 'jinja {{ messages }}' });
    });

    it('accepts a response without model alias', async () => {
        const { service } = buildService({ chatTemplate: 'jinja', modelAlias: null, isSleeping: false });

        const result = await service.fetchModelTemplate({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(result.success).toBe(true);
        expect(result.template).toBe('jinja');
    });

    it('fails when the props response is empty', async () => {
        const { service } = buildService(null);

        const result = await service.fetchModelTemplate({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(result).toEqual({ success: false, error: 'props response was empty' });
    });

    it('fails when the model does not expose a chat template', async () => {
        const { service } = buildService({ chatTemplate: null, modelAlias: 'model-a', isSleeping: false });

        const result = await service.fetchModelTemplate({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(result).toEqual({ success: false, error: 'model does not expose a chat template' });
    });

    it('fails when the model alias does not match the requested modelId', async () => {
        const { service } = buildService({ chatTemplate: 'jinja', modelAlias: 'other-model', isSleeping: false });

        const result = await service.fetchModelTemplate({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(result.success).toBe(false);
        expect(result.error).toContain('alias mismatch');
        expect(result.error).toContain('other-model');
    });

    describe('buildModelTemplate', () => {
        it('builds a template with generated id, hash and fresh timestamps when there is no cache', () => {
            const { service, idGenerator, hashProvider } = buildService(null);

            const result = service.buildModelTemplate({ modelId: 'model-a', connection: '10.0.0.1:8080', template: 'jinja' });

            expect(result).toMatchObject({
                id: 'new-id',
                modelId: 'model-a',
                connection: '10.0.0.1:8080',
                template: 'jinja',
                hash: 'hash-of-template',
                editedByUser: false
            });
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(idGenerator.generate).toHaveBeenCalledTimes(1);
            expect(hashProvider.md5).toHaveBeenCalledWith('jinja');
        });

        it('keeps the cached createdAt when a cache exists', () => {
            const { service, hashProvider } = buildService(null);
            const cached = createModelTemplateHelper({ createdAt: new Date('2020-01-01') });

            const result = service.buildModelTemplate({ modelId: 'model-a', connection: '10.0.0.1:8080', template: 'jinja', cached });

            expect(result.createdAt).toEqual(new Date('2020-01-01'));
            expect(result.id).toBe('new-id');
            expect(result.editedByUser).toBe(false);
            expect(hashProvider.md5).toHaveBeenCalledWith('jinja');
        });
    });
});
