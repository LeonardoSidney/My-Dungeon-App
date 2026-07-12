/// <reference types="web" />
import { ILogger } from '@domain/logger';
import { IStreamProvider, StreamProvider } from '@domain/providers';

export class WebStreamProvider implements IStreamProvider {
    constructor(
        private readonly logger: ILogger
    ) { }

    async *stream(params: StreamProvider.params): AsyncGenerator<string> {
        const { url, method, headers, body } = params;

        const options: RequestInit = {
            method,
            headers,
        };

        if (body && Object.keys(body).length > 0) {
            options.body = JSON.stringify(body);
        }

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
                stream: true
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
    }
}
