import { LlamaCppBaseGateway } from '@infra/http/llama-cpp/llamaCppBaseGateway';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { createConnectionHelper } from '@test/helpers';

const mockLogger = {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
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

            const models = await createGateway().getModels(createConnectionHelper());

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

            const models = await createGateway().getModels(createConnectionHelper());

            expect(models).toHaveLength(0);
        });
    });

    describe('applyTemplate', () => {
        const connection = createConnectionHelper({ ip: '192.168.0.1', port: 8080 });

        it('should return prompt from successful response', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ prompt: 'templated prompt' }));

            const prompt = await createGateway().applyTemplate(connection, 'model-a', 'system', []);

            expect(prompt).toBe('templated prompt');
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://192.168.0.1:8080/apply-template',
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('should throw with server error message on non-ok response', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse(
                { error: { code: 400, message: 'model is not loaded', type: 'invalid_request_error' } },
                false,
                400
            ));

            const gateway = createGateway();

            await expect(
                gateway.applyTemplate(connection, 'model-a', 'system', [])
            ).rejects.toThrow('applyTemplate failed with status 400: model is not loaded');
        });

        it('should throw with fallback message when error body is not json', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockRejectedValue(new Error('not json'))
            } as unknown as Response);

            const gateway = createGateway();

            await expect(
                gateway.applyTemplate(connection, 'model-a', 'system', [])
            ).rejects.toThrow('applyTemplate failed with status 500: no error details');
        });

        it('should wrap fetch network errors', async () => {
            globalThis.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

            const gateway = createGateway();

            await expect(
                gateway.applyTemplate(connection, 'model-a', 'system', [])
            ).rejects.toThrow('Error calling applyTemplate on http://192.168.0.1:8080/apply-template: ECONNREFUSED');
        });

        it('should return null when response has no prompt', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue(mockResponse({ something: 'else' }));

            const prompt = await createGateway().applyTemplate(connection, 'model-a', 'system', []);

            expect(prompt).toBeNull();
        });

        it('should throw when response is not valid json', async () => {
            globalThis.fetch = jest.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockRejectedValue(new Error('not json'))
            } as unknown as Response);

            const gateway = createGateway();

            await expect(
                gateway.applyTemplate(connection, 'model-a', 'system', [])
            ).rejects.toThrow('Error calling applyTemplate on http://192.168.0.1:8080/apply-template: not json');
        });
    });
});
