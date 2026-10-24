import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

const WORLD = { key: 'world', label: 'World' } as const;

type WorldLookup = { success: boolean; error?: string; world?: { id: string; }; };

function lookup (responses: Record<string, WorldLookup>) {
    return jest.fn(async (id: string): Promise<WorldLookup> => responses[id] ?? { success: true });
}

describe('validateReferencedIds', () => {
    describe('checkReferencedId', () => {
        it('accepts a missing id without resolving it', async () => {
            const resolve = lookup({});

            await expect(checkReferencedId(resolve, WORLD, undefined)).resolves.toBeNull();
            await expect(checkReferencedId(resolve, WORLD, '')).resolves.toBeNull();
            expect(resolve).not.toHaveBeenCalled();
        });

        it('accepts an id that resolves to an entity', async () => {
            const resolve = lookup({ w1: { success: true, world: { id: 'w1' } } });

            await expect(checkReferencedId(resolve, WORLD, 'w1')).resolves.toBeNull();
            expect(resolve).toHaveBeenCalledWith('w1');
        });

        it('reports an id that does not resolve to an entity', async () => {
            await expect(checkReferencedId(lookup({}), WORLD, 'w1')).resolves.toBe('World not found: w1');
        });

        it.each([
            [{ success: false, error: 'storage offline' }, 'storage offline'],
            [{ success: false }, 'Failed to load World: w1']
        ])('reports a lookup that answers %j', async (response, error) => {
            await expect(checkReferencedId(lookup({ w1: response }), WORLD, 'w1')).resolves.toBe(error);
        });
    });

    describe('checkReferencedIds', () => {
        it('accepts every id when all of them resolve', async () => {
            const resolve = lookup({ w1: { success: true, world: { id: 'w1' } }, w2: { success: true, world: { id: 'w2' } } });

            await expect(checkReferencedIds(resolve, WORLD, ['w1', 'w2'])).resolves.toBeNull();
            expect(resolve.mock.calls.map(([id]) => id)).toEqual(['w1', 'w2']);
        });

        it('stops at the first id that does not resolve', async () => {
            const resolve = lookup({ w1: { success: true, world: { id: 'w1' } } });

            await expect(checkReferencedIds(resolve, WORLD, ['w1', 'w2', 'w3'])).resolves.toBe('World not found: w2');
            expect(resolve).toHaveBeenCalledTimes(2);
        });
    });
});
