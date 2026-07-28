export type EraseAdventureUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseAdventureUseCase {
    execute (adventureId: string): Promise<EraseAdventureUseCaseReturn>;
}
