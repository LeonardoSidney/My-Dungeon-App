import { TextInputKeyPressEvent } from 'react-native';
import { OnKeyPressInputParams } from './constants';

interface ExtendedKeyPressEventData {
    key: string;
    shiftKey?: boolean;
}

export async function onKeyPressInput (event: TextInputKeyPressEvent, params: OnKeyPressInputParams) {
    const { message, setMessage, handleSendMessage } = params;

    if (event.nativeEvent.key !== 'Enter') return;

    const isShift = (event.nativeEvent as ExtendedKeyPressEventData).shiftKey;

    if (isShift) {
        setMessage(`${message}\n`);
        event.preventDefault();
        return;
    }

    event.preventDefault();
    await handleSendMessage();
}
