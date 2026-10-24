export type EraseSamplerUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseSamplerUseCase {
    execute (params: EraseSamplerUseCaseParams): Promise<EraseSamplerUseCaseReturn>;
}

export type EraseSamplerUseCaseParams = {
    id: string;
};
