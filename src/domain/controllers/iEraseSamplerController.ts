export interface IEraseSamplerController {
    handle (samplerId: string): Promise<EraseSamplerControllerResponse>;
}

export type EraseSamplerControllerResponse = {
    success: boolean;
    error?: string;
};
