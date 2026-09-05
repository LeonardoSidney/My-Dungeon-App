export type EraseItemUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseItemUseCase {
    execute (itemId: string): Promise<EraseItemUseCaseReturn>;
}
