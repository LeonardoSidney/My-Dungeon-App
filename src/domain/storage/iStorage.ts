export interface IStorage {
    save<T>(name: string, value: T): Promise<StorageSaveReturn>;
    saveMany(entries: Record<string, unknown>): Promise<StorageSaveReturn>;
    load<T>(name: string): Promise<StorageLoadReturn<T>>;
    loadMany<T>(names: string[]): Promise<StorageLoadManyReturn<T>>;
    remove(name: string): Promise<StorageRemoveReturn>;
    removeMany(names: string[]): Promise<StorageRemoveReturn>;
}

export type StorageSaveReturn = {
    success: boolean;
    error?: string;
};

export type StorageLoadReturn<T> = {
    success: boolean;
    data?: T | null;
    error?: string;
};

export type StorageLoadManyReturn<T> = {
    success: boolean;
    data?: Record<string, T | null>;
    error?: string;
};

export type StorageRemoveReturn = {
    success: boolean;
    error?: string;
};
