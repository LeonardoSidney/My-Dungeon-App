import { ILogger } from '@domain/logger';
import { IStreamProvider, StreamProvider } from '@domain/providers';
import EventSource, { ErrorEvent, MessageEvent, TimeoutEvent, ExceptionEvent } from 'react-native-sse';

export class ReactNativeStreamProvider implements IStreamProvider {
    constructor (private readonly logger: ILogger) {}

    stream (params: StreamProvider.params): IStreamProvider.StreamResult {
        const { url, method, headers, body } = params;

        const options = {
            method: method || 'GET',
            headers: headers || {},
            body: body ? JSON.stringify(body) : undefined,
        };

        const es = new EventSource(url, options);
        let isAborted = false;

        const queue: string[] = [];
        let resolveNext: ((value: void) => void) | null = null;
        let isFinished = false;
        let error: Error | null = null;

        es.addEventListener('message', event => {
            const e = event as MessageEvent;
            if (e.data) {
                const isDone = e.data === '[DONE]';

                if (isDone) {
                    isFinished = true;
                    es.close();
                }

                if (!isDone && !isAborted) {
                    queue.push(e.data);
                }

                if (resolveNext) {
                    resolveNext();
                    resolveNext = null;
                }
            }
        });

        es.addEventListener('error', (event: ErrorEvent | TimeoutEvent | ExceptionEvent) => {
            const message = (event as ErrorEvent).message;
            error = new Error(message || 'SSE Error');
            isFinished = true;
            es.close();
            if (resolveNext) {
                resolveNext();
                resolveNext = null;
            }
        });

        es.addEventListener('close', () => {
            isFinished = true;
            if (resolveNext) {
                resolveNext();
                resolveNext = null;
            }
        });

        async function* generate (): AsyncGenerator<string> {
            try {
                while (true) {
                    if (queue.length > 0) {
                        const data = queue.shift()!;
                        yield data;
                        continue;
                    }

                    if (isFinished) {
                        const shouldThrow = error && !isAborted;

                        if (shouldThrow) throw error;
                        break;
                    }

                    await new Promise<void>(resolve => {
                        resolveNext = resolve;
                    });
                }
            } finally {
                es.close();
            }
        }

        return {
            stream: generate(),
            abort: () => {
                isAborted = true;
                es.close();
            },
        };
    }
}
