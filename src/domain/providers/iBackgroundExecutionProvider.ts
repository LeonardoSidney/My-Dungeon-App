export interface IBackgroundExecutionProvider {
    acquire (): void;
    release (): void;
}
