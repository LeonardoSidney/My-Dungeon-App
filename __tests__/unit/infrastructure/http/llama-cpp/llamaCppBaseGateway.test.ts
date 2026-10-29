import { RoleEnum } from '@domain/entities';
import { LlamaCppBaseGateway } from '@infra/http/llama-cpp/llamaCppBaseGateway';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { createConnectionHelper } from '@test/helpers';

const mockLogger = {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn()
};

class TestLlamaCppGateway extends LlamaCppBaseGateway {
}

function createGateway (): TestLlamaCppGateway {
    return new TestLlamaCppGateway(mockLogger as unknown as ILogger, null as unknown as IStreamProvider);
}

function mockResponse (body: unknown, ok = true, status = 200): Response {
    return {
        ok,
        status,
        json: jest.fn().mockResolvedValue(body)
    } as unknown as Response;
}

describe('LlamaCppBaseGateway', () => {
    let originalFetch: typeof fetch;

    beforeEach(() => {
        originalFetch = globalThis.fetch;
        jest.clearAllMocks();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('getModels', () => {
        it('should map loaded status to Model.loaded', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({
                data: [
                    { id: 'model-a', owned_by: 'llamacpp', meta: { n_ctx: 4096 }, status: { value: 'loaded' } },
                    { id: 'model-b', owned_by: 'llamacpp', meta: { n_ctx: 8192 }, status: { value: 'unloaded' } },
                    { id: 'model-c', owned_by: 'llamacpp', meta: { n_ctx: 16384 } }
                ]
            }));

            const { success, models } = await createGateway().getModels(createConnectionHelper());

            expect(success).toBe(true);
            expect(models).toHaveLength(3);
            expect(models?.[0].loaded).toBe(true);
            expect(models?.[1].loaded).toBe(false);
            expect(models?.[2].loaded).toBe(false);
        });

        it('should skip models without n_ctx', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({
                data: [
                    { id: 'model-a', owned_by: 'llamacpp', status: { value: 'loaded' } }
                ]
            }));

            const { models } = await createGateway().getModels(createConnectionHelper());

            expect(models).toHaveLength(0);
        });

        it('should report fetch network errors', async () => {
            globalThis.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

            const result = await createGateway().getModels(createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080 }));

            expect(result).toEqual({ success: false, error: 'Error fetching models from http://192.168.0.1:8080/models: ECONNREFUSED' });
        });

        it('should report non Error rejections as strings', async () => {
            globalThis.fetch = jest.fn().mockRejectedValue('socket hang up');

            const result = await createGateway().getModels(createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080 }));

            expect(result).toEqual({ success: false, error: 'Error fetching models from http://192.168.0.1:8080/models: socket hang up' });
        });

        it('should keep an ip that already has a scheme and omit a missing port', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: 'https://llama.example.com', port: undefined, auth: undefined }));

            expect(globalThis.fetch).toHaveBeenCalledWith('https://llama.example.com/models', { headers: {} });
        });

        it('should default to https when the address has no scheme', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: 'api.example.com', port: undefined, auth: undefined }));

            expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/models', { headers: {} });
        });

        it('should default to https for a lan address without scheme', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: '192.168.0.1', port: 8080, auth: undefined }));

            expect(globalThis.fetch).toHaveBeenCalledWith('https://192.168.0.1:8080/models', { headers: {} });
        });

        it('should keep an explicit http scheme', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: undefined }));

            expect(globalThis.fetch).toHaveBeenCalledWith('http://192.168.0.1:8080/models', { headers: {} });
        });

        it('should keep a scheme written in uppercase', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: 'HTTP://192.168.0.1', port: 8080, auth: undefined }));

            expect(globalThis.fetch).toHaveBeenCalledWith('HTTP://192.168.0.1:8080/models', { headers: {} });
        });

        it('should treat a host that starts with http as an address without scheme', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: 'httpbin.org', port: undefined, auth: undefined }));

            expect(globalThis.fetch).toHaveBeenCalledWith('https://httpbin.org/models', { headers: {} });
        });

        it('should send the auth token as a bearer authorization header', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: 'secret-key' }));

            expect(globalThis.fetch).toHaveBeenCalledWith('http://192.168.0.1:8080/models', { headers: { Authorization: 'Bearer secret-key' } });
        });

        it('should not send an authorization header when the connection has no auth token', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ data: [] }));

            await createGateway().getModels(createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: undefined }));

            expect(globalThis.fetch).toHaveBeenCalledWith('http://192.168.0.1:8080/models', { headers: {} });
        });

        it('should fail on a non-ok response', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({}, false, 503));

            const result = await createGateway().getModels(createConnectionHelper());

            expect(result).toEqual({ success: false, error: 'getModels failed with status 503' });
        });

        it('should fail when the response is not valid json', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockRejectedValue(new Error('not json'))
            } as unknown as Response);

            const result = await createGateway().getModels(createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080 }));

            expect(result).toEqual({ success: false, error: 'Error reading models from http://192.168.0.1:8080/models: not json' });
        });

        it.each([
            ['the body is not a record', 'not a record'],
            ['the body has no data list', { data: 'nope' }]
        ])('should fail when %s', async (_, body) => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse(body));

            const result = await createGateway().getModels(createConnectionHelper());

            expect(result).toEqual({ success: false, error: 'Models response does not contain a models list' });
        });

        it('should skip entries without id or owner and prefer the reported name', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({
                data: [
                    { owned_by: 'llamacpp', meta: { n_ctx: 4096 } },
                    { id: 'model-b', meta: { n_ctx: 4096 } },
                    { id: 'org/model-c', owned_by: 'llamacpp', name: 'Model C', meta: { n_ctx: 4096 } },
                    { id: 'org/model-d', owned_by: 'llamacpp', meta: { n_ctx: 4096 } }
                ]
            }));

            const { models } = await createGateway().getModels(createConnectionHelper());

            expect(models?.map(model => [model.id, model.name])).toEqual([
                ['org/model-c', 'Model C'],
                ['org/model-d', 'model-d']
            ]);
        });
    });

    describe('applyTemplate', () => {
        const connection = createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: undefined });

        it('should send only the json content type when the connection has no auth token', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ prompt: 'templated prompt' }));

            await createGateway().applyTemplate({ connection, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://192.168.0.1:8080/apply-template',
                expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
            );
        });

        it('should send the auth token as a bearer authorization header', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ prompt: 'templated prompt' }));
            const authenticated = createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: 'secret-key' });

            await createGateway().applyTemplate({ connection: authenticated, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://192.168.0.1:8080/apply-template',
                expect.objectContaining({ headers: { 'Content-Type': 'application/json', Authorization: 'Bearer secret-key' } })
            );
        });

        it('should return prompt from successful response', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ prompt: 'templated prompt' }));

            const result = await createGateway().applyTemplate({ connection, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(result).toEqual({ success: true, prompt: 'templated prompt' });
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://192.168.0.1:8080/apply-template',
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('should fail with server error message on non-ok response', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse(
                { error: { code: 400, message: 'model is not loaded', type: 'invalid_request_error' } },
                false,
                400
            ));

            const gateway = createGateway();

            const result = await gateway.applyTemplate({ connection, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(result).toEqual({ success: false, error: 'applyTemplate failed with status 400: model is not loaded' });
        });

        it('should fail with fallback message when error body is not json', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockRejectedValue(new Error('not json'))
            } as unknown as Response);

            const gateway = createGateway();

            const result = await gateway.applyTemplate({ connection, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(result).toEqual({ success: false, error: 'applyTemplate failed with status 500: no error details' });
        });

        it('should report fetch network errors', async () => {
            globalThis.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

            const gateway = createGateway();

            const result = await gateway.applyTemplate({ connection, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(result).toEqual({ success: false, error: 'Error calling applyTemplate on http://192.168.0.1:8080/apply-template: ECONNREFUSED' });
        });

        it('should fail when response has no prompt', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ something: 'else' }));

            const result = await createGateway().applyTemplate({ connection, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(result).toEqual({ success: false, error: 'Model did not return a prompt' });
        });

        it('should fail when response is not valid json', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockRejectedValue(new Error('not json'))
            } as unknown as Response);

            const gateway = createGateway();

            const result = await gateway.applyTemplate({ connection, modelId: 'model-a', systemPrompt: 'system', messages: [] });

            expect(result).toEqual({ success: false, error: 'Error calling applyTemplate on http://192.168.0.1:8080/apply-template: not json' });
        });

        describe('reasoning_content', () => {
            function getLastRequestBody (): { model: string; messages: { role: string; content: string; reasoning_content?: string; }[]; } {
                const fetchMock = globalThis.fetch as jest.Mock;
                return JSON.parse(fetchMock.mock.calls[0][1].body);
            }

            it('should send the reasoning of a message as reasoning_content', async () => {
                globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ prompt: 'templated prompt' }));

                await createGateway().applyTemplate({
                    connection,
                    modelId: 'model-a',
                    systemPrompt: 'system',
                    messages: [
                        { role: RoleEnum.USER, content: 'hello' },
                        { role: RoleEnum.ASSISTANT, content: 'partial answer', reasoning: 'deep reasoning' },
                    ],
                });

                expect(getLastRequestBody().messages).toEqual([
                    { role: 'system', content: 'system' },
                    { role: 'user', content: 'hello' },
                    { role: 'assistant', content: 'partial answer', reasoning_content: 'deep reasoning' },
                ]);
            });

            it('should omit reasoning_content when a message has no reasoning', async () => {
                globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ prompt: 'templated prompt' }));

                await createGateway().applyTemplate({
                    connection,
                    modelId: 'model-a',
                    systemPrompt: 'system',
                    messages: [
                        { role: RoleEnum.USER, content: 'hello' },
                        { role: RoleEnum.ASSISTANT, content: 'partial answer' },
                    ],
                });

                expect(getLastRequestBody().messages).toEqual([
                    { role: 'system', content: 'system' },
                    { role: 'user', content: 'hello' },
                    { role: 'assistant', content: 'partial answer' },
                ]);
            });
        });
    });

    describe('getProps', () => {
        const connection = createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: undefined });

        it('should send the auth token as a bearer authorization header', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ chat_template: 't' }));
            const authenticated = createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: 'secret-key' });

            await createGateway().getProps({ connection: authenticated, modelId: 'model-a' });

            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://192.168.0.1:8080/props?model=model-a&autoload=false',
                { headers: { Authorization: 'Bearer secret-key' } }
            );
        });

        it('should map chat_template and model_alias from the response', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({
                chat_template: 'jinja {{ messages }}',
                model_alias: 'model-a',
                is_sleeping: true,
                model_path: '/models/model-a.gguf'
            }));

            const result = await createGateway().getProps({ connection, modelId: 'model-a' });

            expect(result).toEqual({ success: true, props: { chatTemplate: 'jinja {{ messages }}', modelAlias: 'model-a', isSleeping: true } });
            expect(globalThis.fetch).toHaveBeenCalledWith('http://192.168.0.1:8080/props?model=model-a&autoload=false', { headers: {} });
        });

        it('should return null for missing optional fields', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ model_path: '/models/dummy.gguf' }));

            const result = await createGateway().getProps({ connection, modelId: 'model-a' });

            expect(result).toEqual({ success: true, props: { chatTemplate: null, modelAlias: null, isSleeping: false } });
        });

        it('should encode the modelId in the url', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ chat_template: 't' }));

            await createGateway().getProps({ connection, modelId: 'my/model name' });

            expect(globalThis.fetch).toHaveBeenCalledWith('http://192.168.0.1:8080/props?model=my%2Fmodel%20name&autoload=false', { headers: {} });
        });

        it('should fail with the server error message on non-ok response', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse(
                { error: { code: 400, message: 'model is not loaded', type: 'invalid_request_error' } },
                false,
                400
            ));

            const gateway = createGateway();

            const result = await gateway.getProps({ connection, modelId: 'model-a' });

            expect(result).toEqual({ success: false, error: 'getProps failed with status 400: model is not loaded' });
        });

        it('should report fetch network errors', async () => {
            globalThis.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

            const gateway = createGateway();

            const result = await gateway.getProps({ connection, modelId: 'model-a' });

            expect(result).toEqual({ success: false, error: 'Error calling getProps on http://192.168.0.1:8080/props?model=model-a&autoload=false: ECONNREFUSED' });
        });

        it('should fail when the response body is not a record', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse([1, 2, 3]));

            const result = await createGateway().getProps({ connection, modelId: 'model-a' });

            expect(result).toEqual({ success: false, error: 'getProps response is not a record' });
        });

        it('should fail when the response is not valid json', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockRejectedValue(new Error('not json'))
            } as unknown as Response);

            const result = await createGateway().getProps({ connection, modelId: 'model-a' });

            expect(result).toEqual({ success: false, error: 'Error calling getProps on http://192.168.0.1:8080/props?model=model-a&autoload=false: not json' });
        });

        it.each([
            ['the error body is not a record', 'Bad Gateway', 'no error details'],
            ['the error has no message', { error: { code: 500 } }, '{"error":{"code":500}}'],
            ['the body has no error object', { detail: 'boom' }, '{"detail":"boom"}']
        ])('should describe the failure when %s', async (_, body, message) => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse(body, false, 502));

            const result = await createGateway().getProps({ connection, modelId: 'model-a' });

            expect(result).toEqual({ success: false, error: `getProps failed with status 502: ${message}` });
        });
    });
});
