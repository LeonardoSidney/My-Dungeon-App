export type EraseWorldMasterUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldMasterUseCase {
    execute (worldMasterId: string): Promise<EraseWorldMasterUseCaseReturn>;
}
