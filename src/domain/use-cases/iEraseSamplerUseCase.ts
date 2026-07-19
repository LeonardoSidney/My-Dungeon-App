export type EraseSamplerUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseSamplerUseCase {
    execute (samplerId: string): Promise<EraseSamplerUseCaseReturn>;
}
