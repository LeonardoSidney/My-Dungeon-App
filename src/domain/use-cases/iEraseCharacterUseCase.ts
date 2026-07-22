export interface IEraseCharacterUseCase {
    execute(characterId: string): Promise<EraseCharacterReturn>;
}

export type EraseCharacterReturn = {
    success: boolean;
    error?: string;
};
