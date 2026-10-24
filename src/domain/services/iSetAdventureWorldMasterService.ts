import { Adventure } from '../entities';

export interface ISetAdventureWorldMasterService {
  setWorldMaster (params: SetAdventureWorldMasterServiceParams): SetAdventureWorldMasterServiceReturn;
}

export type SetAdventureWorldMasterServiceParams = {
  adventure: Adventure;
  worldMasterId: string;
};

export type SetAdventureWorldMasterServiceReturn = {
  success: boolean;
  adventure?: Adventure;
  error?: string;
};
