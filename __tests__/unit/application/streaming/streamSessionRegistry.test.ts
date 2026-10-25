import { StreamSessionRegistry } from '@application/streaming';
import { createBackgroundExecutionHelper } from '@test/helpers';

describe('StreamSessionRegistry', () => {
    it('accepts only one active session per key', () => {
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());

        expect(registry.start('adventure-1', jest.fn())).toBe(true);
        expect(registry.start('adventure-1', jest.fn())).toBe(false);
        expect(registry.start('adventure-2', jest.fn())).toBe(true);
        expect(registry.isActive('adventure-1')).toBe(true);
    });

    it('calls the abort of the active reply on stop', () => {
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        const abort = jest.fn();
        registry.start('adventure-1', abort);

        expect(registry.stop('adventure-1')).toBe(true);
        expect(abort).toHaveBeenCalled();
    });

    it('reports that there was nothing to stop when no reply is active', () => {
        expect(new StreamSessionRegistry(createBackgroundExecutionHelper()).stop('adventure-1')).toBe(false);
    });

    it('frees the adventure for a new reply after release', () => {
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        registry.start('adventure-1', jest.fn());

        registry.release('adventure-1');

        expect(registry.isActive('adventure-1')).toBe(false);
        expect(registry.start('adventure-1', jest.fn())).toBe(true);
    });

    it('keeps the app alive in the background only while a session is active', () => {
        const backgroundExecution = createBackgroundExecutionHelper();
        const registry = new StreamSessionRegistry(backgroundExecution);

        registry.start('adventure-1', jest.fn());
        expect(backgroundExecution.acquire).toHaveBeenCalledTimes(1);
        expect(backgroundExecution.release).not.toHaveBeenCalled();

        registry.release('adventure-1');
        expect(backgroundExecution.release).toHaveBeenCalledTimes(1);
    });

    it('does not keep the app alive again for a rejected duplicate session', () => {
        const backgroundExecution = createBackgroundExecutionHelper();
        const registry = new StreamSessionRegistry(backgroundExecution);

        registry.start('adventure-1', jest.fn());
        registry.start('adventure-1', jest.fn());

        expect(backgroundExecution.acquire).toHaveBeenCalledTimes(1);
    });

    it('does not let the app be suspended when releasing a key that is not active', () => {
        const backgroundExecution = createBackgroundExecutionHelper();
        const registry = new StreamSessionRegistry(backgroundExecution);

        registry.release('adventure-1');

        expect(backgroundExecution.release).not.toHaveBeenCalled();
    });
});
