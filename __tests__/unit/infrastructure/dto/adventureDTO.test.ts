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

    it('ignores optional world master ids that are missing', () => {
        const entity = AdventureDTO.fromStorage({ ...STORED, worldMasterId: undefined, characterAsWorldMasterId: undefined })?.toEntity();

        expect(entity?.worldMasterId).toBeUndefined();
        expect(entity?.characterAsWorldMasterId).toBeUndefined();
    });

    it('ignores optional world master ids that are not a string', () => {
        const entity = AdventureDTO.fromStorage({ ...STORED, worldMasterId: 42, characterAsWorldMasterId: 42 })?.toEntity();

        expect(entity?.worldMasterId).toBeUndefined();
        expect(entity?.characterAsWorldMasterId).toBeUndefined();
    });

    it('rejects null because it is not a record', () => {
        expect(AdventureDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "adventure" because it is not a record', () => {
        expect(AdventureDTO.fromStorage('adventure')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(AdventureDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored adventure with an invalid id', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored adventure with an invalid name', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, name: undefined })).toBeNull();
    });

    it('rejects a stored adventure with an invalid chat', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, chat: 'not a list' })).toBeNull();
    });

    it('rejects a stored adventure with an invalid characterIds', () => {
        const value = ['hero', 1];

        expect(AdventureDTO.fromStorage({ ...STORED, characterIds: value })).toBeNull();
    });

    it('rejects a stored adventure with an invalid charactersControlledByAi', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, charactersControlledByAi: undefined })).toBeNull();
    });

    it('rejects a stored adventure with an invalid systemPromptIds', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, systemPromptIds: 'prompt-1' })).toBeNull();
    });

    it('rejects a stored adventure with an invalid worldIds', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, worldIds: null })).toBeNull();
    });

    it('rejects a stored adventure with an invalid locationIds', () => {
        const value = [1];

        expect(AdventureDTO.fromStorage({ ...STORED, locationIds: value })).toBeNull();
    });

    it('rejects a stored adventure with an invalid itemIds', () => {
        const value = {};

        expect(AdventureDTO.fromStorage({ ...STORED, itemIds: value })).toBeNull();
    });

    it('rejects a stored adventure with an invalid createdAt', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored adventure with an invalid updatedAt', () => {
        expect(AdventureDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });
});
