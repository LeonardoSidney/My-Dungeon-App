import { createLatestRequestGuard } from '@application/ui/shared/createLatestRequestGuard';

describe('createLatestRequestGuard', () => {
    it('drops a response that arrives after a newer one was applied', () => {
        const guard = createLatestRequestGuard();
        const older = guard.next();
        const newer = guard.next();

        expect(guard.claim(newer)).toBe(true);
        expect(guard.claim(older)).toBe(false);
    });

    it('applies responses that arrive in order', () => {
        const guard = createLatestRequestGuard();
        const first = guard.next();
        const second = guard.next();

        expect(guard.claim(first)).toBe(true);
        expect(guard.claim(second)).toBe(true);
    });
});
