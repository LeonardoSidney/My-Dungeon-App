import { Adventure } from '@domain/entities';
import { IEditAdventureController, IGetWorldMastersController } from '@domain/controllers';

export interface WorldMasterDropdownControllers {
    getWorldMasters: IGetWorldMastersController;
    editAdventure: IEditAdventureController;
}

export interface AdventureChatSettingsProps {
    onBack: () => void;
    adventure: Adventure;
    onWorldMasterSelect: (adventure: Adventure) => void;
    onCharacterSelect?: (adventure: Adventure) => void;
    controllers: WorldMasterDropdownControllers;
}
