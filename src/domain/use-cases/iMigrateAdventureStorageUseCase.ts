export interface IMigrateAdventureStorageUseCase {
    execute(): Promise<MigrateAdventureStorageUseCaseReturn>;
}

export type MigrateAdventureStorageUseCaseReturn = {
    success: boolean;
    error?: string;
};
