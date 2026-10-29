import { SseLineParser, WebStreamProvider } from '@infra/providers/http/stream';
import { ILogger } from '@domain/logger';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const URL = 'http://localhost:8080/completion';

function abortError (): Error {
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    return error;
}

function fakeReader (chunks: string[], failure?: Error) {
    const encoder = new TextEncoder();
    const pending = [...chunks];
    return {
        read: jest.fn(async () => {
            const chunk = pending.shift();
            if (chunk !== undefined) {
                return { done: false, value: encoder.encode(chunk) };
            }
            if (failure) {
                throw failure;
            }
            return { done: true, value: undefined };
        }),
        releaseLock: jest.fn()
    };
}

function mockFetch (response: unknown) {
    const fetchMock = jest.fn().mockImplementation(async () => {
        if (response instanceof Error) {
            throw response;
        }
        return response;
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
}

function okResponse (reader: ReturnType<typeof fakeReader>) {
    return { ok: true, status: 200, body: { getReader: () => reader } };
}

function buildProvider () {
    return new WebStreamProvider(mockLogger, new SseLineParser(mockLogger));
}

async function collect (stream: AsyncIterable<string>): Promise<string[]> {
    const tokens: string[] = [];
    for await (const token of stream) {
        tokens.push(token);
    }
    return tokens;
}

describe('WebStreamProvider', () => {
    let originalFetch: typeof fetch;

    beforeEach(() => {
        originalFetch = globalThis.fetch;
        jest.clearAllMocks();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it('posts the JSON body and yields the SSE data of every chunk', async () => {
        const reader = fakeReader(['data: {"a":1}\n', 'data: {"b"', ':2}\n']);
        const fetchMock = mockFetch(okResponse(reader));

        const tokens = await collect(buildProvider().stream({ url: URL, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { prompt: 'Once' } }).stream);

        expect(tokens).toEqual(['{"a":1}', '{"b":2}']);
        expect(fetchMock).toHaveBeenCalledWith(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: expect.any(Object),
            body: '{"prompt":"Once"}'
        });
        expect(reader.releaseLock).toHaveBeenCalled();
    });

    it.each([
        ['an empty body', {}],
        ['no body', undefined]
    ])('sends the request without a body when given %s', async (_, body) => {
        const fetchMock = mockFetch(okResponse(fakeReader([])));

        await collect(buildProvider().stream({ url: URL, method: 'GET', body }).stream);

        expect(fetchMock.mock.calls[0][1]).not.toHaveProperty('body');
    });

    it('stops reading at [DONE]', async () => {
        const reader = fakeReader(['data: first\ndata: [DONE]\n', 'data: ignored\n']);
        mockFetch(okResponse(reader));

        const tokens = await collect(buildProvider().stream({ url: URL }).stream);

        expect(tokens).toEqual(['first']);
        expect(reader.read).toHaveBeenCalledTimes(1);
    });

    it('passes an abort signal that the returned abort triggers', async () => {
        const fetchMock = mockFetch(okResponse(fakeReader([])));
        const { stream, abort } = buildProvider().stream({ url: URL });

        await collect(stream);
        abort();

        expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(true);
    });

    it('ends quietly when the request is aborted before it answers', async () => {
        mockFetch(abortError());

        const tokens = await collect(buildProvider().stream({ url: URL }).stream);

        expect(tokens).toEqual([]);
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('ends quietly when the request is aborted while reading', async () => {
        const reader = fakeReader(['data: first\n'], abortError());
        mockFetch(okResponse(reader));

        const tokens = await collect(buildProvider().stream({ url: URL }).stream);

        expect(tokens).toEqual(['first']);
        expect(reader.releaseLock).toHaveBeenCalled();
    });

    it('rethrows a request failure', async () => {
        mockFetch(new TypeError('Network request failed'));

        await expect(collect(buildProvider().stream({ url: URL }).stream)).rejects.toThrow('Network request failed');
        expect(mockLogger.error).toHaveBeenCalled();
    });

    it('rethrows a read failure and still releases the reader', async () => {
        const reader = fakeReader([], new Error('connection reset'));
        mockFetch(okResponse(reader));

        await expect(collect(buildProvider().stream({ url: URL }).stream)).rejects.toThrow('connection reset');
        expect(reader.releaseLock).toHaveBeenCalled();
    });

    it('fails when the server answers with an error status', async () => {
        mockFetch({ ok: false, status: 503 });

        await expect(collect(buildProvider().stream({ url: URL }).stream)).rejects.toThrow('Request failed with status 503');
    });

    it('fails when the response has no body', async () => {
        mockFetch({ ok: true, status: 200, body: null });

        await expect(collect(buildProvider().stream({ url: URL }).stream)).rejects.toThrow('Request does not have a body');
    });
});
