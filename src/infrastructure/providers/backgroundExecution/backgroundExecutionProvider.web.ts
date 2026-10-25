import { IBackgroundExecutionProvider } from '@domain/providers';

export class BackgroundExecutionProvider implements IBackgroundExecutionProvider {
    acquire (): void { }

    release (): void { }
}
