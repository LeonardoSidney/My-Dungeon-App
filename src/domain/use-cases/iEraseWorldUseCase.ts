export type EraseWorldUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldUseCase {
    execute (params: EraseWorldUseCaseParams): Promise<EraseWorldUseCaseReturn>;
}

export type EraseWorldUseCaseParams = {
    id: string;
};
