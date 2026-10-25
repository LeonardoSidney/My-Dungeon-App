import { AdventureChatWorldMaster, IAlertController, IGetWorldMastersController, ISetAdventureWorldMasterController } from '@domain/controllers';

export interface UseWorldMasterDropdownParams {
    adventureId: string;
    worldMasterId?: string;
    onWorldMasterChange: () => Promise<void>;
    getWorldMasters: IGetWorldMastersController;
    setAdventureWorldMaster: ISetAdventureWorldMasterController;
    alert: IAlertController;
}

export interface UseAddWorldMasterParams {
    adventureWorldMasterId?: string;
    setWorldMasters: (masters: AdventureChatWorldMaster[]) => void;
    startAdding: () => void;
    getWorldMasters: IGetWorldMastersController;
}

export interface UseSelectWorldMasterParams {
    adventureId: string;
    onWorldMasterChange: () => Promise<void>;
    closeList: () => void;
    setAdventureWorldMaster: ISetAdventureWorldMasterController;
    alert: IAlertController;
}
