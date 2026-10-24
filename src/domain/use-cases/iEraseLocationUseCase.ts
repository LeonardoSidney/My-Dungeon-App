export type EraseLocationUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseLocationUseCase {
    execute (params: EraseLocationUseCaseParams): Promise<EraseLocationUseCaseReturn>;
}

export type EraseLocationUseCaseParams = {
    id: string;
};
