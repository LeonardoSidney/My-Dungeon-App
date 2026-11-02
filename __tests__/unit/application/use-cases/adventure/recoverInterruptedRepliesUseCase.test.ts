import { RecoverInterruptedRepliesUseCase } from '@application/use-cases';
import { StreamSessionRegistry } from '@application/streaming';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { GetAdventureByIdRepositoryReturn } from '@domain/repository';
import { createAdventureHelper, createChatHelper, createBackgroundExecutionHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const interrupted = createAdventureHelper({ id: 'interrupted', chat: [createChatHelper({ id: 'reply', isStreaming: true })] });
const healthy = createAdventureHelper({ id: 'healthy', chat: [createChatHelper({ id: 'done' })] });
const recoveredAdventure = createAdventureHelper({ id: 'interrupted', chat: [createChatHelper({ id: 'reply', isStreaming: false })] });

function toEntry (adventure: Adventure) {
    return {
        id: adventure.id,
        name: adventure.name,
        hasStreamingChat: adventure.chat.some(chat => chat.isStreaming),
        createdAt: adventure.createdAt,
        updatedAt: adventure.updatedAt
    };
}

function build (adventures = [interrupted, healthy], registry = new StreamSessionRegistry(createBackgroundExecutionHelper())) {
    const repository = {
        getAdventureIndex: jest.fn().mockResolvedValue({ success: true, entries: adventures.map(toEntry) }),
        getAdventureById: jest.fn(async (id: string): Promise<GetAdventureByIdRepositoryReturn> => ({ success: true, adventure: adventures.find(adventure => adventure.id === id) })),
        updateAdventure: jest.fn().mockResolvedValue({ success: true })
    };
    const service = { recover: jest.fn().mockReturnValue({ success: true, adventure: recoveredAdventure, recoveredChatIds: ['reply'] }) };
    const useCase = new RecoverInterruptedRepliesUseCase(logger, repository as never, service, registry);
    return { useCase, repository, service };
}

describe('RecoverInterruptedRepliesUseCase', () => {
    it('repairs and saves only the adventures with interrupted chats', async () => {
        const { useCase, repository, service } = build();

        const response = await useCase.execute();

        expect(service.recover).toHaveBeenCalledTimes(1);
        expect(service.recover).toHaveBeenCalledWith({ adventure: interrupted });
        expect(repository.getAdventureById).toHaveBeenCalledTimes(1);
        expect(repository.getAdventureById).toHaveBeenCalledWith('interrupted');
        expect(repository.updateAdventure).toHaveBeenCalledWith({ adventure: recoveredAdventure });
        expect(response).toEqual({ success: true, recoveredChatIds: ['reply'] });
    });

    it('skips an adventure whose reply is still being generated', async () => {
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        registry.start('interrupted', jest.fn());
        const { useCase, service, repository } = build([interrupted], registry);

        const response = await useCase.execute();

        expect(service.recover).not.toHaveBeenCalled();
        expect(repository.updateAdventure).not.toHaveBeenCalled();
        expect(response).toEqual({ success: true, recoveredChatIds: [] });
    });

    it('keeps recovering the other adventures when one fails to save', async () => {
        const second = createAdventureHelper({ id: 'second', chat: [createChatHelper({ id: 'other', isStreaming: true })] });
        const { useCase, repository, service } = build([interrupted, second]);
        repository.updateAdventure
            .mockResolvedValueOnce({ success: false, error: 'storage full' })
            .mockResolvedValueOnce({ success: true });

        const response = await useCase.execute();

        expect(service.recover).toHaveBeenCalledTimes(2);
        expect(response).toEqual({ success: false, recoveredChatIds: ['reply'], error: 'storage full' });
    });

    it('reports a service failure without saving that adventure', async () => {
        const { useCase, repository, service } = build([interrupted]);
        service.recover.mockReturnValue({ success: false, error: 'Chat not found in adventure' });

        const response = await useCase.execute();

        expect(repository.updateAdventure).not.toHaveBeenCalled();
        expect(response).toEqual({ success: false, recoveredChatIds: [], error: 'Chat not found in adventure' });
    });

    it('propagates a failure to load the adventures', async () => {
        const { useCase, repository } = build();
        repository.getAdventureIndex.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await useCase.execute();

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('reports an adventure that cannot be read and keeps recovering the others', async () => {
        const second = createAdventureHelper({ id: 'second', chat: [createChatHelper({ id: 'other', isStreaming: true })] });
        const { useCase, repository, service } = build([interrupted, second]);
        repository.getAdventureById.mockResolvedValueOnce({ success: false, error: 'corrupted' });

        const response = await useCase.execute();

        expect(service.recover).toHaveBeenCalledTimes(1);
        expect(response).toEqual({ success: false, recoveredChatIds: ['reply'], error: 'corrupted' });
    });

    it('reports an indexed adventure that no longer exists', async () => {
        const { useCase, repository, service } = build([interrupted]);
        repository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await useCase.execute();

        expect(service.recover).not.toHaveBeenCalled();
        expect(response).toEqual({ success: false, recoveredChatIds: [], error: 'Adventure with id interrupted not found' });
    });

    it('falls back to generic errors when the service and the repository fail without a message', async () => {
        const second = createAdventureHelper({ id: 'second', chat: [createChatHelper({ id: 'other', isStreaming: true })] });
        const { useCase, repository, service } = build([interrupted, second]);
        service.recover
            .mockReturnValueOnce({ success: false })
            .mockReturnValueOnce({ success: true, adventure: second });
        repository.updateAdventure.mockResolvedValue({ success: false });

        const response = await useCase.execute();

        expect(response).toEqual({
            success: false,
            recoveredChatIds: [],
            error: 'Failed to recover adventure interrupted\nFailed to save adventure second'
        });
    });

    it('succeeds without ids when the service does not report recovered chats', async () => {
        const { useCase, service } = build([interrupted]);
        service.recover.mockReturnValue({ success: true, adventure: recoveredAdventure });

        const response = await useCase.execute();

        expect(response).toEqual({ success: true, recoveredChatIds: [] });
    });
});
