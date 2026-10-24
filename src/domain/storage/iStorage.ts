export interface IStorage {
    save<T>(name: string, value: T): Promise<StorageSaveReturn>;
    load<T>(name: string): Promise<StorageLoadReturn<T>>;
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
