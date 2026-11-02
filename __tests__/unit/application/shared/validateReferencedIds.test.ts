import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

const WORLD = { key: 'world', collection: 'world' } as const;

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
            await expect(checkReferencedId(lookup({}), WORLD, 'w1')).resolves.toBe('Entity not found for id: w1 from Worlds');
        });

        it('reports a lookup that answers { success: false, error: "storage offline" }', async () => {
            const response = { success: false, error: 'storage offline' };

            await expect(checkReferencedId(lookup({ w1: response }), WORLD, 'w1')).resolves.toBe('storage offline');
        });

        it('reports a lookup that answers { success: false }', async () => {
            const response = { success: false };

            await expect(checkReferencedId(lookup({ w1: response }), WORLD, 'w1')).resolves.toBe('Failed to load Worlds: w1');
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

            await expect(checkReferencedIds(resolve, WORLD, ['w1', 'w2', 'w3'])).resolves.toBe('Entity not found for id: w2 from Worlds');
            expect(resolve).toHaveBeenCalledTimes(2);
        });
    });
});
