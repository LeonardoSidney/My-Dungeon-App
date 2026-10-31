export const DEFAULT_SCENE_CONTEXT_ENABLED = false;

export interface IGetSceneContextEnabledUseCase {
    execute (): Promise<GetSceneContextEnabledUseCaseReturn>;
}

export type GetSceneContextEnabledUseCaseReturn = {
    success: boolean;
    sceneContextEnabled?: boolean;
    error?: string;
};
