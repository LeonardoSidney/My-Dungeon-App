import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent } from 'react-native';

export function useKeyboardLift () {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const handleShow = (event: KeyboardEvent) => {
            setKeyboardHeight(event.endCoordinates.height);
        };
        const handleHide = () => {
            setKeyboardHeight(0);
        };

        const showSubscription = Keyboard.addListener('keyboardDidShow', handleShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return keyboardHeight;
}
