import { ReactNativeStreamProvider, SseLineParser } from '@infra/providers/http/stream';
import { ILogger } from '@domain/logger';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const URL = 'http://localhost:8080/completion';

class FakeXMLHttpRequest {
    static readonly HEADERS_RECEIVED = 2;
    static readonly LOADING = 3;
    static readonly DONE = 4;
    static last: FakeXMLHttpRequest;

    readyState = 0;
    responseText = '';
    status = 0;
    open = jest.fn();
    setRequestHeader = jest.fn();
    send = jest.fn();
    abort = jest.fn(() => this.emit('abort'));
    private listeners: Record<string, () => void> = {};

    constructor () {
        FakeXMLHttpRequest.last = this;
    }

    addEventListener (name: string, listener: () => void): void {
        this.listeners[name] = listener;
    }

    emit (name: string): void {
        this.listeners[name]?.();
    }

    receive (text: string, readyState = FakeXMLHttpRequest.LOADING): void {
        this.responseText += text;
        this.readyState = readyState;
        this.emit('readystatechange');
    }

    finish (status = 200): void {
        this.status = status;
        this.receive('', FakeXMLHttpRequest.DONE);
    }
}

function nextTick (): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
}

function buildStream (params: Parameters<ReactNativeStreamProvider['stream']>[0] = { url: URL, method: 'POST', body: { prompt: 'Once' } }) {
    const result = new ReactNativeStreamProvider(mockLogger, new SseLineParser(mockLogger)).stream(params);
    return { ...result, xhr: FakeXMLHttpRequest.last };
}

async function collect (stream: AsyncIterable<string>): Promise<string[]> {
    const tokens: string[] = [];
    for await (const token of stream) {
        tokens.push(token);
    }
    return tokens;
}

describe('ReactNativeStreamProvider', () => {
    let originalXMLHttpRequest: typeof XMLHttpRequest;

    beforeEach(() => {
        originalXMLHttpRequest = globalThis.XMLHttpRequest;
        globalThis.XMLHttpRequest = FakeXMLHttpRequest as unknown as typeof XMLHttpRequest;
        jest.clearAllMocks();
    });

    afterEach(() => {
        globalThis.XMLHttpRequest = originalXMLHttpRequest;
    });

    it('opens the request with the SSE headers and sends the JSON body on the first read', async () => {
        const { stream, xhr } = buildStream({ url: URL, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { prompt: 'Once' } });

        expect(xhr.open).toHaveBeenCalledWith('POST', URL, true);
        expect(xhr.setRequestHeader.mock.calls).toEqual([
            ['Accept', 'text/event-stream'],
            ['Cache-Control', 'no-cache'],
            ['Content-Type', 'application/json']
        ]);
        expect(xhr.send).not.toHaveBeenCalled();

        const tokens = collect(stream);
        await nextTick();
        xhr.finish();
        await tokens;

        expect(xhr.send).toHaveBeenCalledWith('{"prompt":"Once"}');
    });

    it('defaults to GET without body nor extra headers', async () => {
        const { stream, xhr } = buildStream({ url: URL });

        const tokens = collect(stream);
        await nextTick();
        xhr.finish();
        await tokens;

        expect(xhr.open).toHaveBeenCalledWith('GET', URL, true);
        expect(xhr.setRequestHeader).toHaveBeenCalledTimes(2);
        expect(xhr.send).toHaveBeenCalledWith(undefined);
    });

    it('yields the SSE data received across progress events', async () => {
        const { stream, xhr } = buildStream();

        const tokens = collect(stream);
        await nextTick();
        xhr.receive('', FakeXMLHttpRequest.HEADERS_RECEIVED);
        xhr.receive('data: {"a":1}\ndata: {"b"');
        xhr.receive('');
        await nextTick();
        xhr.receive(':2}\n');
        xhr.receive('data: tail');
        xhr.finish();

        await expect(tokens).resolves.toEqual(['{"a":1}', '{"b":2}', 'tail']);
    });

    it('ends at [DONE] even if the server keeps the request open', async () => {
        const { stream, xhr } = buildStream();

        const tokens = collect(stream);
        await nextTick();
        xhr.receive('data: first\ndata: [DONE]\n');

        await expect(tokens).resolves.toEqual(['first']);

        xhr.receive('data: [DONE]\n');
        xhr.finish(500);
    });

    it('fails when the server answers with an error status', async () => {
        const { stream, xhr } = buildStream();

        const tokens = collect(stream);
        await nextTick();
        xhr.finish(500);

        await expect(tokens).rejects.toThrow('Request failed with status 500');
    });

    it.each([
        ['error', `Request to ${URL} failed`],
        ['timeout', `Request to ${URL} timed out`]
    ])('fails when the request emits %s', async (event, message) => {
        const { stream, xhr } = buildStream();

        const tokens = collect(stream);
        await nextTick();
        xhr.emit(event);

        await expect(tokens).rejects.toThrow(message);
        expect(mockLogger.error).toHaveBeenCalled();
    });

    it('ends without error when aborted, ignoring the error event that follows', async () => {
        const { stream, xhr, abort } = buildStream();

        const tokens = collect(stream);
        await nextTick();
        xhr.receive('data: first\n');
        await nextTick();
        abort();
        xhr.emit('error');
        xhr.finish(0);

        await expect(tokens).resolves.toEqual(['first']);
        expect(xhr.abort).toHaveBeenCalled();
    });

    it('aborts the request when the consumer stops reading early', async () => {
        const { stream, xhr } = buildStream();

        const reading = (async () => {
            for await (const token of stream) {
                return token;
            }
            return undefined;
        })();
        await nextTick();
        xhr.receive('data: first\ndata: second\n');

        await expect(reading).resolves.toBe('first');
        expect(xhr.abort).toHaveBeenCalled();
    });
});
