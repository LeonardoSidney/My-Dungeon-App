import { AdventureIndexEntryDTO } from '@infra/dto';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const STORED = {
    id: 'adv-1',
    name: 'Quest',
    hasStreamingChat: true,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('AdventureIndexEntryDTO', () => {
    it('converts a stored entry into an entity with real dates', () => {
        const entry = AdventureIndexEntryDTO.fromStorage(STORED)?.toEntity();

        expect(entry).toEqual({ id: 'adv-1', name: 'Quest', hasStreamingChat: true, createdAt, updatedAt });
    });

    it('rejects a value that is not an object', () => {
        expect(AdventureIndexEntryDTO.fromStorage('adv-1')).toBeNull();
    });

    it('rejects an entry without an id', () => {
        expect(AdventureIndexEntryDTO.fromStorage({ ...STORED, id: undefined })).toBeNull();
    });

    it('rejects an entry without a name', () => {
        expect(AdventureIndexEntryDTO.fromStorage({ ...STORED, name: undefined })).toBeNull();
    });

    it('rejects an entry without the streaming flag', () => {
        expect(AdventureIndexEntryDTO.fromStorage({ ...STORED, hasStreamingChat: undefined })).toBeNull();
    });

    it('rejects an entry with an invalid creation date', () => {
        expect(AdventureIndexEntryDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects an entry with an invalid update date', () => {
        expect(AdventureIndexEntryDTO.fromStorage({ ...STORED, updatedAt: 'not a date' })).toBeNull();
    });
});
