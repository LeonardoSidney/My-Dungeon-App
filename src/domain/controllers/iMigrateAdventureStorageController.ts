export interface IMigrateAdventureStorageController {
    handle(): Promise<MigrateAdventureStorageControllerResponse>;
}

export type MigrateAdventureStorageControllerResponse = {
    success: boolean;
    error?: string;
};
