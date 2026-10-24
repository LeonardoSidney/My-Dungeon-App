import { DeleteChatVersionService } from '@application/services';
import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function adventureWith (content: string[], index: number) {
    return createAdventureHelper({
        chat: [
            createChatHelper({ id: 'user-1', role: RoleEnum.USER, content, index }),
            createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT })
        ]
    });
}

describe('DeleteChatVersionService', () => {
    const service = new DeleteChatVersionService(mockLogger);

    it('deletes a middle version and reveals the previous one', () => {
        const result = service.deleteVersion({ adventure: adventureWith(['M0', 'M1', 'M2', 'M3'], 2), chatId: 'user-1', versionIndex: 2 });

        expect(result.success).toBe(true);
        expect(result.adventure?.chat[0]).toEqual(expect.objectContaining({ content: ['M0', 'M1', 'M3'], index: 1 }));
    });

    it('keeps the first remaining version when the first one is deleted', () => {
        const result = service.deleteVersion({ adventure: adventureWith(['v0', 'v1'], 0), chatId: 'user-1', versionIndex: 0 });

        expect(result.adventure?.chat[0]).toEqual(expect.objectContaining({ content: ['v1'], index: 0 }));
    });

    it('never touches the following assistant chat', () => {
        const result = service.deleteVersion({ adventure: adventureWith(['v0', 'v1'], 1), chatId: 'user-1', versionIndex: 1 });

        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1']);
    });

    it('refuses to delete the only version, which means deleting the chat', () => {
        const result = service.deleteVersion({ adventure: adventureWith(['only'], 0), chatId: 'user-1', versionIndex: 0 });

        expect(result.success).toBe(false);
        expect(result.error).toContain('delete the chat instead');
    });

    it('rejects an out of bounds version index instead of guessing', () => {
        const result = service.deleteVersion({ adventure: adventureWith(['v0', 'v1'], 0), chatId: 'user-1', versionIndex: 5 });

        expect(result).toEqual({ success: false, error: 'Version index 5 is out of bounds' });
    });

    it('returns an error when the chat was not found', () => {
        const result = service.deleteVersion({ adventure: adventureWith(['v0', 'v1'], 0), chatId: 'missing', versionIndex: 0 });

        expect(result.error).toContain('missing');
    });
});
