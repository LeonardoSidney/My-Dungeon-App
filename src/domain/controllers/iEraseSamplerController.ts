export interface IEraseSamplerController {
    handle (request: EraseSamplerControllerRequest): Promise<EraseSamplerControllerResponse>;
}

export type EraseSamplerControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseSamplerControllerRequest = {
    id: string;
};
