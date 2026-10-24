export type EraseItemUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseItemUseCase {
    execute (params: EraseItemUseCaseParams): Promise<EraseItemUseCaseReturn>;
}

export type EraseItemUseCaseParams = {
    id: string;
};
