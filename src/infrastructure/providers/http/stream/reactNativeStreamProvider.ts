/// <reference types="web" />
import { ILogger } from '@domain/logger';
import { ISseLineParser, IStreamProvider, StreamProvider } from '@domain/providers';

export class ReactNativeStreamProvider implements IStreamProvider {
    constructor (
        private readonly logger: ILogger,
        private readonly sseLineParser: ISseLineParser
    ) { }

    stream (params: StreamProvider.params): IStreamProvider.StreamResult {
        const { url, method, headers, body } = params;
        this.logger.info('Executing ReactNativeStreamProvider::stream', url);

        const xhr = new XMLHttpRequest();
        const isAbortedRef = { current: false };
        const xhrErrorRef: { current: Error | null; } = { current: null };
        const xhrStatusRef = { current: 0 };

        const requestBody = this.stringifyBody(body);
        const requestHeaders = {
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
            ...(headers || {})
        };

        const parser = this.sseLineParser;
        const queue: string[] = [];
        let processedLength = 0;
        let resolveNext: (() => void) | null = null;
        let isFinished = false;

        const notify = () => {
            if (resolveNext) {
                const resolve = resolveNext;
                resolveNext = null;
                resolve();
            }
        };

        const onStreamDone = () => {
            if (isFinished) {
                return;
            }

            isFinished = true;
            notify();
        };

        const onReadyStateChange = () => {
            const readyState = xhr.readyState;
            const isRelevantState = readyState === XMLHttpRequest.LOADING || readyState === XMLHttpRequest.DONE;
            if (!isRelevantState) {
                return;
            }

            const rawText = xhr.responseText;
            const newChunk = rawText.slice(processedLength);
            processedLength = rawText.length;

            const hasNewData = newChunk !== '';
            if (hasNewData) {
                parser.process(newChunk, queue, onStreamDone);
            }

            if (readyState === XMLHttpRequest.DONE) {
                parser.flush(queue, onStreamDone);
                if (!isFinished) {
                    xhrStatusRef.current = xhr.status;
                    isFinished = true;
                }
            }

            if (hasNewData || readyState === XMLHttpRequest.DONE) {
                notify();
            }
        };

        const finishWithError = (errorMessage: string) => {
            this.logger.error('ReactNativeStreamProvider::stream failed:', errorMessage);
            parser.flush([], onStreamDone);
            xhrErrorRef.current = new Error(errorMessage);
            isFinished = true;
            notify();
        };

        const onAbort = () => {
            parser.flush([], onStreamDone);
            isFinished = true;
            notify();
        };

        const onError = () => {
            if (isAbortedRef.current) {
                return;
            }

            const message = `Request to ${url} failed`;
            finishWithError(message);
        };

        const onTimeout = () => {
            finishWithError(`Request to ${url} timed out`);
        };

        xhr.open(method || 'GET', url, true);

        for (const [name, value] of Object.entries(requestHeaders)) {
            xhr.setRequestHeader(name, value);
        }

        xhr.addEventListener('readystatechange', onReadyStateChange);
        xhr.addEventListener('abort', onAbort);
        xhr.addEventListener('error', onError);
        xhr.addEventListener('timeout', onTimeout);

        const abort = () => {
            isAbortedRef.current = true;
            xhr.abort();
        };

        const logger = this.logger;

        async function* generate (): AsyncGenerator<string> {
            try {
                xhr.send(requestBody === undefined ? undefined : requestBody);

                while (true) {
                    if (queue.length > 0) {
                        yield queue.shift()!;
                        continue;
                    }

                    if (isFinished) {
                        const errorToThrow = xhrErrorRef.current;
                        if (errorToThrow !== null) {
                            throw errorToThrow;
                        }

                        if (!isAbortedRef.current && xhrStatusRef.current >= 400) {
                            logger.error(`ReactNativeStreamProvider::stream failed with status ${xhrStatusRef.current}`, url);
                            throw new Error(`Request failed with status ${xhrStatusRef.current}`);
                        }

                        break;
                    }

                    await new Promise<void>(resolve => {
                        resolveNext = resolve;
                    });
                }
            } catch (error) {
                isFinished = true;
                notify();
                throw error;
            } finally {
                if (!isFinished) {
                    isFinished = true;
                    abort();
                    notify();
                }
            }
        }

        return {
            stream: generate(),
            abort,
        };
    }

    private stringifyBody (body: Record<string, unknown> | undefined): string | undefined {
        if (!body) {
            return undefined;
        }

        return JSON.stringify(body);
    }
}
