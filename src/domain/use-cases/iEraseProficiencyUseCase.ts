export type EraseProficiencyUseCaseReturn = {
  success: boolean;
  error?: string;
};

export interface IEraseProficiencyUseCase {
  execute (params: EraseProficiencyUseCaseParams): Promise<EraseProficiencyUseCaseReturn>;
}

export type EraseProficiencyUseCaseParams = {
    id: string;
};
