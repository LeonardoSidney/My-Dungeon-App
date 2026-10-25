import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useSidebarAnimation (isVisible: boolean, width: number): Animated.Value {
    const translateX = useRef(new Animated.Value(isVisible ? 0 : -width)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: isVisible ? 0 : -width,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    }, [isVisible, width, translateX]);

    return translateX;
}
