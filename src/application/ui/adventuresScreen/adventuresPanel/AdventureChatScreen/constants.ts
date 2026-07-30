import { Adventure } from '@domain/entities';

export interface AdventureChatScreenProps {
    adventure: Adventure;
    onBack: () => void;
    onCharacterSelect?: (adventure: Adventure) => void;
}
