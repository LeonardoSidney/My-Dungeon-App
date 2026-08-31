export interface ISseLineParser {
    process (newText: string, queue: string[], onDone: () => void): void;
    flush (queue: string[], onDone: () => void): void;
}
