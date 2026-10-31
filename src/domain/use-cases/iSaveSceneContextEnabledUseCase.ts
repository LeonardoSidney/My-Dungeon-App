export interface ISaveSceneContextEnabledUseCase {
    execute (params: SaveSceneContextEnabledUseCaseParams): Promise<SaveSceneContextEnabledUseCaseReturn>;
}

export type SaveSceneContextEnabledUseCaseParams = {
    sceneContextEnabled: boolean;
};

export type SaveSceneContextEnabledUseCaseReturn = {
    success: boolean;
    sceneContextEnabled?: boolean;
    error?: string;
};
