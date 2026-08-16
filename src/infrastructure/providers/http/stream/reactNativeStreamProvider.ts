/// <reference types="web" />
import { ILogger } from '@domain/logger';
import { IStreamProvider, StreamProvider } from '@domain/providers';

class SseLineParser {
    private pendingLine = '';

    process (newText: string, queue: string[], onDone: () => void): void {
        this.pendingLine += newText;
        const parts = this.pendingLine.split('\n');
        this.pendingLine = parts.pop() ?? '';

        for (const part of parts) {
            const dataValue = this.parseDataLine(part);
            if (dataValue === undefined) {
                continue;
            }

            const isDone = dataValue === '[DONE]';
            if (isDone) {
                onDone();
                return;
            }

            queue.push(dataValue);
        }
    }

    flush (queue: string[], onDone: () => void): void {
        if (!this.pendingLine) {
            return;
        }

        const dataValue = this.parseDataLine(this.pendingLine);
        this.pendingLine = '';
        if (dataValue === undefined) {
            return;
        }

        const isDone = dataValue === '[DONE]';
        if (isDone) {
            onDone();
            return;
        }

        queue.push(dataValue);
    }

    private parseDataLine (line: string): string | undefined {
        const trimmedLine = line.trim();
        const isDataLine = trimmedLine.startsWith('data:');
        if (!isDataLine) {
            return undefined;
        }

        const dataValue = trimmedLine.replace(/^data:\s?/, '');
        if (!dataValue) {
            return undefined;
        }

        return dataValue;
    }
}

export class ReactNativeStreamProvider implements IStreamProvider {
    constructor (private readonly logger: ILogger) { }

    stream (params: StreamProvider.params): IStreamProvider.StreamResult {
        const { url, method, headers, body } = params;

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

        const parser = new SseLineParser();
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
            xhrErrorRef.current = new Error(errorMessage);
            isFinished = true;
            notify();
        };

        const onAbort = () => {
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
