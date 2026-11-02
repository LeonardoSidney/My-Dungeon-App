export interface IGetAdventureMissingReferencesController {
    handle (params: GetAdventureMissingReferencesControllerParams): Promise<GetAdventureMissingReferencesControllerResponse>;
}

export type GetAdventureMissingReferencesControllerParams = {
    adventureId: string;
};

export type GetAdventureMissingReferencesControllerResponse = {
    success: boolean;
    issues?: string[];
    error?: string;
};
