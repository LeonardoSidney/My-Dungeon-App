export interface IGetSceneContextEnabledController {
    handle (): Promise<GetSceneContextEnabledControllerResponse>;
}

export type GetSceneContextEnabledControllerResponse = {
    success: boolean;
    sceneContextEnabled?: boolean;
    error?: string;
};
