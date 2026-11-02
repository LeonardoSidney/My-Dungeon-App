import { isArrayRecord, isInEnum, isRecord, isStringArray, parseDate } from '@infra/dto/shared';

enum Color {
    RED = 'red',
    BLUE = 'blue'
}

describe('dto shared helpers', () => {
    describe('isRecord', () => {
        it('accepts {}', () => {
            const value = {};

            expect(isRecord(value)).toBe(true);
        });

        it('accepts { id: 1 }', () => {
            const value = { id: 1 };

            expect(isRecord(value)).toBe(true);
        });

        it('accepts []', () => {
            const value: unknown[] = [];

            expect(isRecord(value)).toBe(true);
        });

        it('rejects null', () => {
            expect(isRecord(null)).toBe(false);
        });

        it('rejects undefined', () => {
            expect(isRecord(undefined)).toBe(false);
        });

        it('rejects "text"', () => {
            expect(isRecord('text')).toBe(false);
        });

        it('rejects 42', () => {
            expect(isRecord(42)).toBe(false);
        });
    });

    describe('parseDate', () => {
        it('returns a date instance as it is', () => {
            const date = new Date('2026-01-01T00:00:00.000Z');

            expect(parseDate(date)).toBe(date);
        });

        it('parses an ISO string', () => {
            expect(parseDate('2026-01-01T00:00:00.000Z')).toEqual(new Date('2026-01-01T00:00:00.000Z'));
        });

        it('parses a timestamp', () => {
            const value = Date.parse('2026-01-01T00:00:00.000Z');

            expect(parseDate(value)).toEqual(new Date('2026-01-01T00:00:00.000Z'));
        });

        it('rejects an invalid string', () => {
            expect(parseDate('not a date')).toBeNull();
        });

        it('rejects NaN', () => {
            expect(parseDate(Number.NaN)).toBeNull();
        });

        it('rejects null', () => {
            expect(parseDate(null)).toBeNull();
        });

        it('rejects an object', () => {
            const value = {};

            expect(parseDate(value)).toBeNull();
        });
    });

    describe('isArrayRecord', () => {
        it('accepts a list of records', () => {
            expect(isArrayRecord([{ id: 1 }, {}])).toBe(true);
        });

        it('rejects [{ id: 1 }, "text"]', () => {
            const value = [{ id: 1 }, 'text'];

            expect(isArrayRecord(value)).toBe(false);
        });

        it('rejects { id: 1 }', () => {
            const value = { id: 1 };

            expect(isArrayRecord(value)).toBe(false);
        });
    });

    describe('isStringArray', () => {
        it('accepts []', () => {
            const value: unknown[] = [];

            expect(isStringArray(value)).toBe(true);
        });

        it('accepts ["a", "b"]', () => {
            const value = ['a', 'b'];

            expect(isStringArray(value)).toBe(true);
        });

        it('rejects ["a", 1]', () => {
            const value = ['a', 1];

            expect(isStringArray(value)).toBe(false);
        });

        it('rejects "a"', () => {
            expect(isStringArray('a')).toBe(false);
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
