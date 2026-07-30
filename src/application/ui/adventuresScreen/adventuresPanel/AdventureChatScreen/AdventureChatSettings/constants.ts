import { Adventure } from '@domain/entities';

export interface AdventureChatSettingsProps {
    onBack: () => void;
    adventure: Adventure;
    onWorldMasterSelect: (adventure: Adventure) => void;
}
