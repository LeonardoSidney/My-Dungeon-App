import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { SIDEBAR_WIDTH } from './constants';

export function useSidebarPanel (isWideScreen: boolean, panelTranslateX: Animated.Value) {
    const [isPanelOpen, setPanelOpen] = useState(false);

    useEffect(() => {
        setPanelOpen(isWideScreen);
    }, [isWideScreen]);

    useEffect(() => {
        const shouldShowPanel = isWideScreen || isPanelOpen;
        Animated.spring(panelTranslateX, {
            toValue: shouldShowPanel ? 0 : -SIDEBAR_WIDTH,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    }, [isWideScreen, isPanelOpen, panelTranslateX]);

    const togglePanel = () => {
        setPanelOpen(previousValue => !previousValue);
    };

    return { isPanelOpen, togglePanel };
}
