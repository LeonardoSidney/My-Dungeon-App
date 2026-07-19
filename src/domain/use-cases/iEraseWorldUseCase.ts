export type EraseWorldUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldUseCase {
    execute (worldId: string): Promise<EraseWorldUseCaseReturn>;
}
