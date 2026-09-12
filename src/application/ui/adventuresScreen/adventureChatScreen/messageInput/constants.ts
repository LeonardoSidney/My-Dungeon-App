import { Character } from '@domain/entities';
import { TextInputKeyPressEvent } from 'react-native';

export interface MessageInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onKeyPress: (event: TextInputKeyPressEvent) => void;
    isStreaming: boolean;
    onSend: () => void;
    onResend: () => void;
    characters: Character[];
    selectedCharacterId: string;
    onCharacterSelect: (character: Character) => void;
}
