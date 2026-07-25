export type EraseAbilityUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseAbilityUseCase {
    execute (abilityId: string): Promise<EraseAbilityUseCaseReturn>;
}
