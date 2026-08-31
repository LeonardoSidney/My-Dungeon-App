import { ILogger } from '@domain/logger';
import { ISseLineParser } from '@domain/providers';

export class SseLineParser implements ISseLineParser {
    private pendingLine = '';

    constructor (private readonly logger: ILogger) { }

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
                this.logger.info('Executing SseLineParser::process - SSE [DONE] received, stream finished');
                onDone();
                return;
            }

            queue.push(dataValue);
        }

        if (this.pendingLine) {
            this.logger.debug('Executing SseLineParser::process - line split across chunks, holding incomplete line', this.pendingLine);
        }
    }

    flush (queue: string[], onDone: () => void): void {
        if (!this.pendingLine) {
            return;
        }

        this.logger.debug('Executing SseLineParser::flush - rejoining incomplete line held across chunks', this.pendingLine);

        const dataValue = this.parseDataLine(this.pendingLine);
        this.pendingLine = '';
        if (dataValue === undefined) {
            return;
        }

        const isDone = dataValue === '[DONE]';
        if (isDone) {
            this.logger.info('Executing SseLineParser::flush - SSE [DONE] received, stream finished');
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
