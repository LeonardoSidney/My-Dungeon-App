import { AdventureChatWorldMaster, IAlertController, IGetWorldMastersController, ISetAdventureWorldMasterController } from '@domain/controllers';

export interface WorldMasterDropdownControllers {
    getWorldMasters: IGetWorldMastersController;
    setAdventureWorldMaster: ISetAdventureWorldMasterController;
    alert: IAlertController;
}

export interface AdventureChatSettingsProps {
    onBack: () => void;
    adventureId: string;
    adventureName: string;
    worldMaster?: AdventureChatWorldMaster;
    onWorldMasterChange: () => Promise<void>;
    controllers: WorldMasterDropdownControllers;
}
