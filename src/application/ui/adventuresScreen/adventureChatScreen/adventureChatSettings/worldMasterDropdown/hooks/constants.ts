import { Adventure, WorldMaster } from '@domain/entities';
import { IAlertController, IEditAdventureController, IGetWorldMastersController } from '@domain/controllers';

export interface UseWorldMasterDropdownParams {
    adventure: Adventure;
    onWorldMasterSelect: (adventure: Adventure) => void;
    getWorldMasters: IGetWorldMastersController;
    editAdventure: IEditAdventureController;
    alert: IAlertController;
}

export interface UseAddWorldMasterParams {
    adventureWorldMasterId?: string;
    setWorldMasters: (masters: WorldMaster[]) => void;
    startAdding: () => void;
    getWorldMasters: IGetWorldMastersController;
}

export interface UseSelectWorldMasterParams {
    adventure: Adventure;
    onWorldMasterSelect: (adventure: Adventure) => void;
    closeList: () => void;
    editAdventure: IEditAdventureController;
    alert: IAlertController;
}
