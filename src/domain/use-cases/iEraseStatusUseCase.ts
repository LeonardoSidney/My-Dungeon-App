export type EraseStatusUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseStatusUseCase {
    execute (params: EraseStatusUseCaseParams): Promise<EraseStatusUseCaseReturn>;
}

export type EraseStatusUseCaseParams = {
    id: string;
};
