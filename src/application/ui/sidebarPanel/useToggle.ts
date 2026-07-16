import { useState } from 'react';
import { Animated } from 'react-native';
import { SIDEBAR_WIDTH } from '@application/ui/sidebarPanel/constants';

export function useToggle(initialValue: boolean, panelTranslateX: Animated.Value) {
    const [isVisible, setIsVisible] = useState(initialValue);

    const toggleVisibility = () => {
        const newValue = !isVisible;
        setIsVisible(newValue);
        Animated.spring(panelTranslateX, {
            toValue: newValue ? 0 : -SIDEBAR_WIDTH,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    };

    return { isVisible, toggleVisibility };
}
