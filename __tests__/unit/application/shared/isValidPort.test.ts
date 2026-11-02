import { isValidPort } from '@application/shared/isValidPort';

describe('isValidPort', () => {
    it('accepts the lowest port', () => {
        expect(isValidPort(1)).toBe(true);
    });

    it('accepts the highest port', () => {
        expect(isValidPort(65535)).toBe(true);
    });

    it('accepts a port inside the range', () => {
        expect(isValidPort(8080)).toBe(true);
    });

    it('rejects port zero', () => {
        expect(isValidPort(0)).toBe(false);
    });

    it('rejects a negative port', () => {
        expect(isValidPort(-1)).toBe(false);
    });

    it('rejects a port above the highest one', () => {
        expect(isValidPort(65536)).toBe(false);
    });

    it('rejects a decimal port', () => {
        expect(isValidPort(80.5)).toBe(false);
    });

    it('rejects NaN', () => {
        expect(isValidPort(Number.NaN)).toBe(false);
    });

    it('rejects infinity', () => {
        expect(isValidPort(Number.POSITIVE_INFINITY)).toBe(false);
    });
});
