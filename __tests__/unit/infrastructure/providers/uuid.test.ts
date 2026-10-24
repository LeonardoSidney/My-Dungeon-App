import { UUIDGenerator } from '@infra/providers';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('UUIDGenerator', () => {
    const generator = new UUIDGenerator();

    it('generates ids in the uuid v4 format', () => {
        for (let i = 0; i < 50; i++) {
            expect(generator.generate()).toMatch(UUID_V4);
        }
    });

    it('generates a different id on each call', () => {
        const ids = new Set(Array.from({ length: 50 }, () => generator.generate()));

        expect(ids.size).toBe(50);
    });

    it.each([
        [0, '00000000-0000-4000-8000-000000000000'],
        [0.999, 'ffffffff-ffff-4fff-bfff-ffffffffffff']
    ])('uses Math.random %p for every hex digit and the variant', (random, expected) => {
        const spy = jest.spyOn(Math, 'random').mockReturnValue(random);

        expect(generator.generate()).toBe(expected);

        spy.mockRestore();
    });
});
