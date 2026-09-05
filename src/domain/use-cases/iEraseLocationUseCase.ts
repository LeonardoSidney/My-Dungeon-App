export type EraseLocationUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseLocationUseCase {
    execute (locationId: string): Promise<EraseLocationUseCaseReturn>;
}
