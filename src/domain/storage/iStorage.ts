export interface IStorage {
    save<T>(name: string, value: T): Promise<void>;
    load<T>(name: string): Promise<T | null>;
}
