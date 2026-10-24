export type EraseConnectionUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseConnectionUseCase {
    execute (params: EraseConnectionUseCaseParams): Promise<EraseConnectionUseCaseReturn>;
}

export type EraseConnectionUseCaseParams = {
    id: string;
};
