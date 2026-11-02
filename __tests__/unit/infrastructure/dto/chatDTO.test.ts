import { ChatDTO } from '@infra/dto';
import { RoleEnum } from '@domain/entities';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const STORED = {
    id: 'chat-1',
    role: RoleEnum.ASSISTANT,
    index: 1,
    thinkIndex: 0,
    content: ['first', 'second'],
    think: [{ id: 'think-1', content: 'reasoning', enabled: true }],
    characterId: 'character-1',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('ChatDTO', () => {
    it('converts a stored chat into an entity with parsed dates', () => {
        expect(ChatDTO.fromStorage(STORED)?.toEntity()).toEqual({ ...STORED, createdAt, updatedAt });
    });

    it('keeps the model that generated the reply and ignores a model id that is not text', () => {
        expect(ChatDTO.fromStorage({ ...STORED, modelId: 'qwen3' })?.toEntity().modelId).toBe('qwen3');
        expect(ChatDTO.fromStorage({ ...STORED, modelId: 42 })?.toEntity().modelId).toBeUndefined();
    });

    it('keeps a chat marked as streaming', () => {
        expect(ChatDTO.fromStorage({ ...STORED, isStreaming: true })?.toEntity().isStreaming).toBe(true);
    });

    it('keeps a chat marked as not streaming', () => {
        expect(ChatDTO.fromStorage({ ...STORED, isStreaming: false })?.toEntity().isStreaming).toBe(false);
    });

    it('ignores a streaming flag that is not a boolean', () => {
        expect(ChatDTO.fromStorage({ ...STORED, isStreaming: 'true' })?.toEntity().isStreaming).toBeUndefined();
    });

    it('falls back to the content index when the think index was not stored', () => {
        expect(ChatDTO.fromStorage({ ...STORED, thinkIndex: undefined })?.toEntity().thinkIndex).toBe(1);
    });

    it('keeps only the string content versions and an empty list when content is not a list', () => {
        expect(ChatDTO.fromStorage({ ...STORED, content: ['kept', 42, null] })?.toEntity().content).toEqual(['kept']);
        expect(ChatDTO.fromStorage({ ...STORED, content: 'not a list' })?.toEntity().content).toEqual([]);
    });

    it('drops invalid thinks and ignores a think value that is not a list of records', () => {
        const valid = { id: 'think-1', content: 'reasoning', enabled: true };

        expect(ChatDTO.fromStorage({ ...STORED, think: [valid, { id: 'broken' }] })?.toEntity().think).toEqual([valid]);
        expect(ChatDTO.fromStorage({ ...STORED, think: 'reasoning' })?.toEntity().think).toBeUndefined();
    });

    it('rejects null because it is not a record', () => {
        expect(ChatDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "chat" because it is not a record', () => {
        expect(ChatDTO.fromStorage('chat')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(ChatDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored chat with an invalid id', () => {
        expect(ChatDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored chat with an unknown role', () => {
        expect(ChatDTO.fromStorage({ ...STORED, role: 'narrator' })).toBeNull();
    });

    it('rejects a stored chat with a role that is not a string', () => {
        expect(ChatDTO.fromStorage({ ...STORED, role: 7 })).toBeNull();
    });

    it('rejects a stored chat with an invalid index', () => {
        expect(ChatDTO.fromStorage({ ...STORED, index: '1' })).toBeNull();
    });

    it('rejects a stored chat with an invalid characterId', () => {
        expect(ChatDTO.fromStorage({ ...STORED, characterId: undefined })).toBeNull();
    });

    it('rejects a stored chat with an invalid createdAt', () => {
        expect(ChatDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored chat with an invalid updatedAt', () => {
        expect(ChatDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });
});
