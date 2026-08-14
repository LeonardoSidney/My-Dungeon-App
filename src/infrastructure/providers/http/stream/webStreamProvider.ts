/// <reference types="web" />
import { ILogger } from '@domain/logger';
import { IStreamProvider, StreamProvider } from '@domain/providers';

export class WebStreamProvider implements IStreamProvider {
    constructor (private readonly logger: ILogger) {}

    stream (params: StreamProvider.params): IStreamProvider.StreamResult {
        const { url, method, headers, body } = params;

        const abortController = new AbortController();

        const options: RequestInit = {
            method,
            headers,
            signal: abortController.signal,
        };

        if (body && Object.keys(body).length > 0) {
            options.body = JSON.stringify(body);
        }

        async function* generate (): AsyncGenerator<string> {
            try {
                const request = await fetch(url, options);

                if (!request.ok) {
                    throw new Error('Something is wrong');
                }

                if (!request.body) {
                    throw new Error('request does not have body');
                }

                const reader = request.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    const text = decoder.decode(value, {
                        stream: true,
                    });

                    for (const line of text.split('\n')) {
                        if (!line.startsWith('data: ')) {
                            continue;
                        }

                        const json = line.slice(6);

                        if (json === '[DONE]') {
                            break;
                        }

                        yield json;
                    }
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    throw error;
                }
            }
        }

        return {
            stream: generate(),
            abort: () => abortController.abort(),
        };
    }
}
