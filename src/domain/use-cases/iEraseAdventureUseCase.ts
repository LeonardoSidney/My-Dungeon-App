export type EraseAdventureUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseAdventureUseCase {
    execute (params: EraseAdventureUseCaseParams): Promise<EraseAdventureUseCaseReturn>;
}

export type EraseAdventureUseCaseParams = {
    id: string;
};
