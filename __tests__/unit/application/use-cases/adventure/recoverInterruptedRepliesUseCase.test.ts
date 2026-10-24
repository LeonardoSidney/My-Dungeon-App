import { RecoverInterruptedRepliesUseCase } from '@application/use-cases';
import { StreamSessionRegistry } from '@application/streaming';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const interrupted = createAdventureHelper({ id: 'interrupted', chat: [createChatHelper({ id: 'reply', isStreaming: true })] });
const healthy = createAdventureHelper({ id: 'healthy', chat: [createChatHelper({ id: 'done' })] });
const recoveredAdventure = createAdventureHelper({ id: 'interrupted', chat: [createChatHelper({ id: 'reply', isStreaming: false })] });

function build (adventures = [interrupted, healthy], registry = new StreamSessionRegistry()) {
    const repository = {
        getAdventures: jest.fn().mockResolvedValue({ success: true, adventures }),
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
        expect(repository.updateAdventure).toHaveBeenCalledWith({ adventure: recoveredAdventure });
        expect(response).toEqual({ success: true, recoveredChatIds: ['reply'] });
    });

    it('skips an adventure whose reply is still being generated', async () => {
        const registry = new StreamSessionRegistry();
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
        repository.getAdventures.mockResolvedValue({ success: false, error: 'storage offline' });

        const response = await useCase.execute();

        expect(response).toEqual({ success: false, error: 'storage offline' });
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
