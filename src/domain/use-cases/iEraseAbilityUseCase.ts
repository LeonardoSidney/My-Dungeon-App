export type EraseAbilityUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseAbilityUseCase {
    execute (params: EraseAbilityUseCaseParams): Promise<EraseAbilityUseCaseReturn>;
}

export type EraseAbilityUseCaseParams = {
    id: string;
};
