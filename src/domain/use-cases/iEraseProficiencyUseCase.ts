export type EraseProficiencyUseCaseReturn = {
  success: boolean;
  error?: string;
};

export interface IEraseProficiencyUseCase {
  execute (proficiencyId: string): Promise<EraseProficiencyUseCaseReturn>;
}
