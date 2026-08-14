import { Adventure, WorldMaster } from '@domain/entities';

export interface UseWorldMasterDropdownParams {
    adventure: Adventure;
    onWorldMasterSelect: (adventure: Adventure) => void;
}

export interface UseAddWorldMasterParams {
    adventureWorldMasterId?: string;
    setWorldMasters: (masters: WorldMaster[]) => void;
    startAdding: () => void;
}

export interface UseSelectWorldMasterParams {
    adventure: Adventure;
    onWorldMasterSelect: (adventure: Adventure) => void;
    closeList: () => void;
}
