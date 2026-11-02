import { GetAdventureIndexUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const ENTRY = {
    id: 'adv-1',
    name: 'Quest',
    hasStreamingChat: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z')
};

describe('GetAdventureIndexUseCase', () => {
    it('returns the index entries', async () => {
        const repository = { getAdventureIndex: jest.fn().mockResolvedValue({ success: true, entries: [ENTRY] }) };

        const response = await new GetAdventureIndexUseCase(logger, repository as never).execute();

        expect(response).toEqual({ success: true, entries: [ENTRY] });
    });

    it('propagates a repository failure', async () => {
        const repository = { getAdventureIndex: jest.fn().mockResolvedValue({ success: false, error: 'storage offline' }) };

        const response = await new GetAdventureIndexUseCase(logger, repository as never).execute();

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('fails when the repository succeeds without entries', async () => {
        const repository = { getAdventureIndex: jest.fn().mockResolvedValue({ success: true }) };

        const response = await new GetAdventureIndexUseCase(logger, repository as never).execute();

        expect(response).toEqual({ success: false, error: undefined });
    });
});
