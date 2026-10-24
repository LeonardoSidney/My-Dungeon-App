import { listItems, nameIndex, resolveReferencedIds } from '@src/migrations/shared';

const hero = { id: 'c1', name: 'Hero' };
const villain = { id: 'c2', name: 'Villain' };

describe('migrations shared helpers', () => {
    describe('listItems', () => {
        it('returns the items of a successful response', () => {
            expect(listItems({ success: true, items: [hero] }, 'characters')).toEqual({ success: true, items: [hero] });
        });

        it.each([
            [{ success: false, error: 'storage offline' }, 'Migration: failed to load characters: storage offline'],
            [{ success: true }, 'Migration: failed to load characters: undefined']
        ])('fails when the response is %j', (response, error) => {
            expect(listItems(response, 'characters')).toEqual({ success: false, error });
        });
    });

    describe('nameIndex', () => {
        it('indexes the entities by name', () => {
            const index = nameIndex([hero, villain]);

            expect(index.get('Hero')).toBe(hero);
            expect(index.get('Villain')).toBe(villain);
            expect(index.size).toBe(2);
        });
    });

    describe('resolveReferencedIds', () => {
        const index = nameIndex([hero, villain]);

        it('resolves every name to its id in order', () => {
            expect(resolveReferencedIds(index, ['Villain', 'Hero'], 'character', 'adventure "Quest"')).toEqual({ success: true, ids: ['c2', 'c1'] });
        });

        it('fails at the first name that does not exist', () => {
            expect(resolveReferencedIds(index, ['Hero', 'Ghost'], 'character', 'adventure "Quest"')).toEqual({
                success: false,
                error: 'Migration: character "Ghost" for adventure "Quest" does not exist'
            });
        });
    });
});
