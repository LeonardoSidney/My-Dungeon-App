export type EraseWorldMasterUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldMasterUseCase {
    execute (params: EraseWorldMasterUseCaseParams): Promise<EraseWorldMasterUseCaseReturn>;
}

export type EraseWorldMasterUseCaseParams = {
    id: string;
};
