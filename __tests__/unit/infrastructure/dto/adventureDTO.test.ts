import { AdventureDTO } from '@infra/dto';
import { RoleEnum } from '@domain/entities';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const CHAT = {
    id: 'chat-1',
    role: RoleEnum.USER,
    index: 0,
    thinkIndex: 0,
    content: ['hello'],
    characterId: 'hero',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

const STORED = {
    id: 'adv-1',
    name: 'Quest',
    chat: [CHAT],
    characterIds: ['hero', 'npc'],
    worldMasterId: 'wm-1',
    characterAsWorldMasterId: 'hero',
    charactersControlledByAi: ['npc'],
    systemPromptIds: ['prompt-1'],
    worldIds: ['world-1'],
    locationIds: ['location-1'],
    itemIds: ['item-1'],
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('AdventureDTO', () => {
    it('converts a stored adventure and its chat into an entity with parsed dates', () => {
        expect(AdventureDTO.fromStorage(STORED)?.toEntity()).toEqual({
            ...STORED,
            chat: [{ ...CHAT, think: undefined, createdAt, updatedAt }],
            createdAt,
            updatedAt
        });
    });

    it('drops the chats that are not valid', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, chat: [CHAT, { id: 'broken' }] })?.toEntity().chat.map(c => c.id)).toEqual(['chat-1']);
    });

    it.each([
        ['missing', undefined],
        ['not a string', 42]
    ])('ignores optional world master ids that are %s', (_, value) => {
        const entity = AdventureDTO.fromStorage({ ...STORED, worldMasterId: value, characterAsWorldMasterId: value })?.toEntity();

        expect(entity?.worldMasterId).toBeUndefined();
        expect(entity?.characterAsWorldMasterId).toBeUndefined();
    });

    it.each([null, 'adventure', 42])('rejects %p because it is not a record', (data) => {
        expect(AdventureDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['name', undefined],
        ['chat', 'not a list'],
        ['characterIds', ['hero', 1]],
        ['charactersControlledByAi', undefined],
        ['systemPromptIds', 'prompt-1'],
        ['worldIds', null],
        ['locationIds', [1]],
        ['itemIds', {}],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined]
    ])('rejects a stored adventure with an invalid %s', (field, value) => {
        expect(AdventureDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
