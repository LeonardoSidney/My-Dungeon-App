import { isArrayRecord, isInEnum, isRecord, isStringArray, parseDate } from '@infra/dto/shared';

enum Color {
    RED = 'red',
    BLUE = 'blue'
}

describe('dto shared helpers', () => {
    describe('isRecord', () => {
        it.each([{}, { id: 1 }, []])('accepts %p', (value) => {
            expect(isRecord(value)).toBe(true);
        });

        it.each([null, undefined, 'text', 42])('rejects %p', (value) => {
            expect(isRecord(value)).toBe(false);
        });
    });

    describe('parseDate', () => {
        it('returns a date instance as it is', () => {
            const date = new Date('2026-01-01T00:00:00.000Z');

            expect(parseDate(date)).toBe(date);
        });

        it.each([
            ['an ISO string', '2026-01-01T00:00:00.000Z'],
            ['a timestamp', Date.parse('2026-01-01T00:00:00.000Z')]
        ])('parses %s', (_, value) => {
            expect(parseDate(value)).toEqual(new Date('2026-01-01T00:00:00.000Z'));
        });

        it.each([
            ['an invalid string', 'not a date'],
            ['NaN', Number.NaN],
            ['null', null],
            ['an object', {}]
        ])('rejects %s', (_, value) => {
            expect(parseDate(value)).toBeNull();
        });
    });

    describe('isArrayRecord', () => {
        it('accepts a list of records', () => {
            expect(isArrayRecord([{ id: 1 }, {}])).toBe(true);
        });

        it.each([[[{ id: 1 }, 'text']], [{ id: 1 }]])('rejects %p', (value) => {
            expect(isArrayRecord(value)).toBe(false);
        });
    });

    describe('isStringArray', () => {
        it.each([[[]], [['a', 'b']]])('accepts %p', (value) => {
            expect(isStringArray(value)).toBe(true);
        });

        it.each([[['a', 1]], ['a']])('rejects %p', (value) => {
            expect(isStringArray(value)).toBe(false);
        });
    });

    describe('isInEnum', () => {
        it('accepts a value of the enum', () => {
            expect(isInEnum(Color, 'red')).toBe(true);
        });

        it('rejects a value outside the enum', () => {
            expect(isInEnum(Color, 'green')).toBe(false);
        });
    });
});
