export interface ISaveSceneContextEnabledController {
    handle (request: SaveSceneContextEnabledControllerRequest): Promise<SaveSceneContextEnabledControllerResponse>;
}

export type SaveSceneContextEnabledControllerRequest = {
    sceneContextEnabled: boolean;
};

export type SaveSceneContextEnabledControllerResponse = {
    success: boolean;
    sceneContextEnabled?: boolean;
    error?: string;
};
