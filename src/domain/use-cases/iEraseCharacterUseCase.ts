export interface IEraseCharacterUseCase {
    execute (params: EraseCharacterUseCaseParams): Promise<EraseCharacterReturn>;
}

export type EraseCharacterReturn = {
    success: boolean;
    error?: string;
};

export type EraseCharacterUseCaseParams = {
    id: string;
};
