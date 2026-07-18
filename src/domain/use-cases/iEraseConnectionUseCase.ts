export type EraseConnectionUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseConnectionUseCase {
    execute(connectionId: string): Promise<EraseConnectionUseCaseReturn>;
}
