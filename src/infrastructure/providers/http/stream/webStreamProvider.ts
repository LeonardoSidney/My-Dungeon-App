/// <reference types="web" />
import { ILogger } from '@domain/logger';
import { ISseLineParser, IStreamProvider, StreamProvider } from '@domain/providers';

export class WebStreamProvider implements IStreamProvider {
    constructor (
        private readonly logger: ILogger,
        private readonly sseLineParser: ISseLineParser
    ) { }

    stream (params: StreamProvider.params): IStreamProvider.StreamResult {
        const { url, method, headers, body } = params;
        this.logger.info('Executing WebStreamProvider::stream', url);

        const abortController = new AbortController();

        const options: RequestInit = {
            method,
            headers,
            signal: abortController.signal,
        };

        if (body && Object.keys(body).length > 0) {
            options.body = JSON.stringify(body);
        }

        const logger = this.logger;
        const parser = this.sseLineParser;

        async function* generate (): AsyncGenerator<string> {
            let request: Response;
            try {
                request = await fetch(url, options);
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    logger.info('WebStreamProvider::stream aborted', url);
                    return;
                }

                logger.error('WebStreamProvider::stream request failed:', url, error);
                throw error;
            }

            if (!request.ok) {
                logger.error(`WebStreamProvider::stream failed with status ${request.status}`, url);
                throw new Error(`Request failed with status ${request.status}`);
            }

            if (!request.body) {
                logger.error('WebStreamProvider::stream request does not have a body', url);
                throw new Error('Request does not have a body');
            }

            const reader = request.body.getReader();
            const decoder = new TextDecoder();
            let streamDone = false;

            const onStreamDone = () => {
                streamDone = true;
            };

            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    if (streamDone) {
                        break;
                    }

                    const text = decoder.decode(value, {
                        stream: true,
                    });

                    const pendingChunks: string[] = [];
                    parser.process(text, pendingChunks, onStreamDone);

                    for (const chunk of pendingChunks) {
                        yield chunk;
                    }

                    if (streamDone) {
                        break;
                    }
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    logger.info('WebStreamProvider::stream aborted', url);
                } else {
                    logger.error('WebStreamProvider::stream read failed:', url, error);
                    throw error;
                }
            } finally {
                parser.flush([], onStreamDone);
                reader.releaseLock();
            }
        }

        return {
            stream: generate(),
            abort: () => abortController.abort(),
        };
    }
}
