export interface IEraseAdventuresUseCase {
    execute(): Promise<EraseAdventuresUseCaseReturn>;
}

export type EraseAdventuresUseCaseReturn = {
    success: boolean;
    error?: string;
};
