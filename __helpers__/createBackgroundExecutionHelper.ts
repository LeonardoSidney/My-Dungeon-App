import { IBackgroundExecutionProvider } from '@domain/providers';

export function createBackgroundExecutionHelper (): jest.Mocked<IBackgroundExecutionProvider> {
    return {
        acquire: jest.fn(),
        release: jest.fn(),
    };
}
