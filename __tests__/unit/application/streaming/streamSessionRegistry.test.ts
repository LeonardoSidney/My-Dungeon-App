import { StreamSessionRegistry } from '@application/streaming';

describe('StreamSessionRegistry', () => {
    it('accepts only one active session per key', () => {
        const registry = new StreamSessionRegistry();

        expect(registry.start('adventure-1', jest.fn())).toBe(true);
        expect(registry.start('adventure-1', jest.fn())).toBe(false);
        expect(registry.start('adventure-2', jest.fn())).toBe(true);
        expect(registry.isActive('adventure-1')).toBe(true);
    });

    it('calls the abort of the active reply on stop', () => {
        const registry = new StreamSessionRegistry();
        const abort = jest.fn();
        registry.start('adventure-1', abort);

        expect(registry.stop('adventure-1')).toBe(true);
        expect(abort).toHaveBeenCalled();
    });

    it('reports that there was nothing to stop when no reply is active', () => {
        expect(new StreamSessionRegistry().stop('adventure-1')).toBe(false);
    });

    it('frees the adventure for a new reply after release', () => {
        const registry = new StreamSessionRegistry();
        registry.start('adventure-1', jest.fn());

        registry.release('adventure-1');

        expect(registry.isActive('adventure-1')).toBe(false);
        expect(registry.start('adventure-1', jest.fn())).toBe(true);
    });
});
