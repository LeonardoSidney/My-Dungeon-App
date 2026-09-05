import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export function useWindowWidth (): number {
    const [windowWidth, setWindowWidth] = useState(() => Dimensions.get('window').width);

    useEffect(() => {
        const subscriber = Dimensions.addEventListener('change', ({ window: nextWindow }) => {
            setWindowWidth(nextWindow.width);
        });
        return () => subscriber?.remove();
    }, []);

    return windowWidth;
}
