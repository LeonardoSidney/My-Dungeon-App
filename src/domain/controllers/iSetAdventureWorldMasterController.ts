export interface ISetAdventureWorldMasterController {
  handle (params: SetAdventureWorldMasterControllerParams): Promise<SetAdventureWorldMasterControllerResponse>;
}

export type SetAdventureWorldMasterControllerParams = {
  adventureId: string;
  worldMasterId: string;
};

export type SetAdventureWorldMasterControllerResponse = {
  success: boolean;
  error?: string;
};
