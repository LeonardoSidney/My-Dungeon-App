import { Adventure } from '@domain/entities';

export interface AdventureChatScreenProps {
    adventure: Adventure;
    onBack: () => void;
}
