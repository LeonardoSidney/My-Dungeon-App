export interface IEraseSamplerController {
    handle (samplerId: string): Promise<EraseSamplerControllerResponse>;
}

export type EraseSamplerControllerParams = string;

export type EraseSamplerControllerResponse = {
    success: boolean;
    error?: string;
};
