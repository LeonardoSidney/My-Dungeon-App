import { ILogger } from '@domain/logger';
import { IKeyedEventChannel, KeyedEventListener } from '@domain/providers';

export class KeyedEventBus<TEvent> implements IKeyedEventChannel<TEvent> {
    private listeners = new Map<string, Set<KeyedEventListener<TEvent>>>();

    constructor (
        private readonly logger: ILogger,
        private readonly keyOf: (event: TEvent) => string
    ) { }

    publish (event: TEvent): void {
        const listeners = this.listeners.get(this.keyOf(event));
        if (!listeners) {
            return;
        }

        for (const listener of [...listeners]) {
            try {
                listener(event);
            } catch (error) {
                this.logger.error('KeyedEventBus::publish - listener failed', error);
            }
        }
    }

    subscribe (key: string, listener: KeyedEventListener<TEvent>): () => void {
        const listeners = this.listeners.get(key) ?? new Set<KeyedEventListener<TEvent>>();
        listeners.add(listener);
        this.listeners.set(key, listeners);

        return () => {
            listeners.delete(listener);
            if (listeners.size === 0 && this.listeners.get(key) === listeners) {
                this.listeners.delete(key);
            }
        };
    }
}
