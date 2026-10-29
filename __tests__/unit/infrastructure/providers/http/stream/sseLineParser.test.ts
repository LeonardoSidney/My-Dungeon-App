import { SseLineParser } from '@infra/providers/http/stream';
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

function build () {
    return { parser: new SseLineParser(mockLogger), queue: [] as string[], onDone: jest.fn() };
}

describe('SseLineParser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('process', () => {
        it('queues the value of each complete data line', () => {
            const { parser, queue, onDone } = build();

            parser.process('data: {"a":1}\ndata:{"b":2}\n', queue, onDone);

            expect(queue).toEqual(['{"a":1}', '{"b":2}']);
            expect(onDone).not.toHaveBeenCalled();
        });

        it('ignores lines that are not data lines or that carry no value', () => {
            const { parser, queue, onDone } = build();

            parser.process(': ping\nevent: message\n\ndata: \ndata: kept\n', queue, onDone);

            expect(queue).toEqual(['kept']);
        });

        it('holds a line split across chunks until it is complete', () => {
            const { parser, queue, onDone } = build();

            parser.process('data: {"text":"Once', queue, onDone);
            expect(queue).toEqual([]);

            parser.process(' upon"}\n', queue, onDone);
            expect(queue).toEqual(['{"text":"Once upon"}']);
        });

        it('stops at [DONE] and drops the lines after it', () => {
            const { parser, queue, onDone } = build();

            parser.process('data: first\ndata: [DONE]\ndata: ignored\n', queue, onDone);

            expect(queue).toEqual(['first']);
            expect(onDone).toHaveBeenCalledTimes(1);
        });
    });

    describe('flush', () => {
        it('does nothing when no line is held', () => {
            const { parser, queue, onDone } = build();

            parser.flush(queue, onDone);

            expect(queue).toEqual([]);
            expect(onDone).not.toHaveBeenCalled();
        });

        it('queues the held line when the stream ends without a line break', () => {
            const { parser, queue, onDone } = build();
            parser.process('data: last', queue, onDone);

            parser.flush(queue, onDone);
            parser.flush(queue, onDone);

            expect(queue).toEqual(['last']);
        });

        it('drops a held line that is not a data line', () => {
            const { parser, queue, onDone } = build();
            parser.process(': keep-alive', queue, onDone);

            parser.flush(queue, onDone);

            expect(queue).toEqual([]);
        });

        it('finishes the stream when the held line is [DONE]', () => {
            const { parser, queue, onDone } = build();
            parser.process('data: [DONE]', queue, onDone);

            parser.flush(queue, onDone);

            expect(queue).toEqual([]);
            expect(onDone).toHaveBeenCalledTimes(1);
        });
    });
});
