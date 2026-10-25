import { AdventureChatCharacter } from '@domain/controllers';
import { TextInputKeyPressEvent } from 'react-native';

export interface MessageInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onKeyPress: (event: TextInputKeyPressEvent) => void;
    isStreaming: boolean;
    onSend: () => void;
    onResend: () => void;
    characters: AdventureChatCharacter[];
    selectedCharacterId: string;
    onCharacterSelect: (character: AdventureChatCharacter) => void;
}
