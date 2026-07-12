import { ILogger } from '@domain/logger';
import { IStreamProvider, StreamProvider } from '@domain/providers';
import EventSource, { MessageEvent } from 'react-native-sse';

export class ReactNativeStreamProvider implements IStreamProvider {
    constructor(
        private readonly logger: ILogger
    ) { }

    async *stream(params: StreamProvider.params): AsyncGenerator<string> {
        const { url, method, headers, body } = params;

        const options = {
            method: method || 'GET',
            headers: headers || {},
            body: body ? JSON.stringify(body) : undefined,
        };

        const es = new EventSource(url, options);

        const queue: string[] = [];
        let resolveNext: ((value: void) => void) | null = null;
        let isFinished = false;
        let error: Error | null = null;

        es.addEventListener('message', (event) => {
            const e = event as MessageEvent;
            if (e.data) {
                if (e.data === '[DONE]') {
                    isFinished = true;
                    es.close();
                } else {
                    queue.push(e.data);
                }
                
                if (resolveNext) {
                    resolveNext();
                    resolveNext = null;
                }
            }
        });

        es.addEventListener('error', (event: any) => {
            error = new Error(event.message || 'SSE Error');
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

        try {
            while (true) {
                if (queue.length > 0) {
                    const data = queue.shift()!;
                    yield data;
                } else if (isFinished) {
                    if (error) throw error;
                    break;
                } else {
                    await new Promise<void>((resolve) => {
                        resolveNext = resolve;
                    });
                }
            }
        } finally {
            es.close();
        }
    }
}
