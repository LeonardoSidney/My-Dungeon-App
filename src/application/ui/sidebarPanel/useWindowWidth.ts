import { Dimensions, type ScaledSize } from 'react-native';
import { useEffect, useState } from 'react';

export function useWindowWidth(): ScaledSize {
    const [size, setSize] = useState(Dimensions.get('window'));

    useEffect(() => {
        const subscriber = Dimensions.addEventListener('change', ({ window }) => {
            setSize(window);
        });
        return () => subscriber?.remove();
    }, []);

    return size;
}
