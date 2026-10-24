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

    it.each([null, 'chat', 42])('rejects %p because it is not a record', (data) => {
        expect(ChatDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['role', 'narrator'],
        ['role', 7],
        ['index', '1'],
        ['characterId', undefined],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined]
    ])('rejects a stored chat with an invalid %s', (field, value) => {
        expect(ChatDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
