export type KeyedEventListener<TEvent> = (event: TEvent) => void;

export interface IKeyedEventChannel<TEvent> {
    publish (event: TEvent): void;
    subscribe (key: string, listener: KeyedEventListener<TEvent>): () => void;
}
