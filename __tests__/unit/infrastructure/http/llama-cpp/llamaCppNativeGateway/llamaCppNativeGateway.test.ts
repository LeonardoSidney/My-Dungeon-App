import { LlamaCppNativeGateway } from '@infra/http/llama-cpp/llamaCppNativeGateway/llamaCppNativeGateway';
import { ILogger } from '@domain/logger';
import { IStreamProvider } from '@domain/providers';
import { createConnectionHelper, createSamplerHelper } from '@test/helpers';

const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function asyncChunks (chunks: string[]) {
    return (async function* () {
        for (const chunk of chunks) {
            yield chunk;
        }
    })();
}

function buildGateway (chunks: string[]) {
    const abort = jest.fn();
    const streamProvider = { stream: jest.fn().mockReturnValue({ stream: asyncChunks(chunks), abort }) };
    const gateway = new LlamaCppNativeGateway(mockLogger as unknown as ILogger, streamProvider as unknown as IStreamProvider);
    return { gateway, streamProvider, abort };
}

async function collect (stream: AsyncIterable<string>): Promise<string[]> {
    const tokens: string[] = [];
    for await (const token of stream) {
        tokens.push(token);
    }
    return tokens;
}

describe('LlamaCppNativeGateway', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('streamCompletion', () => {
        const params = {
            connection: createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: undefined }),
            sampler: createSamplerHelper({ temperature: 0.5 }),
            modelId: 'model-a',
            prompt: 'Once upon'
        };

        it('posts the sampler payload to /completion and exposes the provider abort', () => {
            const { gateway, streamProvider, abort } = buildGateway([]);

            const result = gateway.streamCompletion(params);

            expect(streamProvider.stream).toHaveBeenCalledWith({
                url: 'http://192.168.0.1:8080/completion',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: expect.objectContaining({ model: 'model-a', prompt: 'Once upon', temperature: 0.5, stream: true })
            });
            expect(result.abort).toBe(abort);
        });

        it('sends the auth token as a bearer authorization header', () => {
            const { gateway, streamProvider } = buildGateway([]);
            const connection = createConnectionHelper({ ip: 'http://192.168.0.1', port: 8080, auth: 'secret-key' });

            gateway.streamCompletion({ ...params, connection });

            expect(streamProvider.stream).toHaveBeenCalledWith(expect.objectContaining({
                url: 'http://192.168.0.1:8080/completion',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer secret-key' }
            }));
        });

        it('skips chunks without content, the stop chunk and chunks that are not JSON', async () => {
            const { gateway } = buildGateway([JSON.stringify({ content: 'Once' }), 'not json', JSON.stringify({ content: 42 }), JSON.stringify({}), JSON.stringify({ content: ' upon' }), JSON.stringify({ content: ' ignored', stop: true })]);

            const tokens = await collect(gateway.streamCompletion(params).stream);

            expect(tokens).toEqual(['Once', ' upon']);
            expect(mockLogger.error).toHaveBeenCalledTimes(1);
        });
    });
});
