import { useEffect } from 'react';
import { Animated } from 'react-native';
import { SIDEBAR_WIDTH } from '@application/ui/sidebarPanel/constants';

export function useSidebarVisibility(isWideScreen: boolean, panelTranslateX: Animated.Value) {
    useEffect(() => {
        Animated.spring(panelTranslateX, {
            toValue: isWideScreen ? 0 : -SIDEBAR_WIDTH,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    }, [isWideScreen, panelTranslateX]);
}
