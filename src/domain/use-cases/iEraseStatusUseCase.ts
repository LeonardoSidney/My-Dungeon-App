export type EraseStatusUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseStatusUseCase {
    execute (statusId: string): Promise<EraseStatusUseCaseReturn>;
}
