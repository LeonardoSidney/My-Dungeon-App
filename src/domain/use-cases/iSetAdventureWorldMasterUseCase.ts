export interface ISetAdventureWorldMasterUseCase {
  execute (params: SetAdventureWorldMasterUseCaseParams): Promise<SetAdventureWorldMasterUseCaseReturn>;
}

export type SetAdventureWorldMasterUseCaseParams = {
  adventureId: string;
  worldMasterId: string;
};

export type SetAdventureWorldMasterUseCaseReturn = {
  success: boolean;
  error?: string;
};
