import * as React from 'react';
import { NavigationContext } from '@react-navigation/core';
import type { NavigationProp, ParamListBase } from '@react-navigation/core';

type NavigationEvent = 'focus' | 'blur';
type NavigationListener = () => void;

export type TestNavigation = {
    isFocused: () => boolean;
    addListener: (type: NavigationEvent, listener: NavigationListener) => () => void;
};

export type TestNavigationHandle = {
    navigation: TestNavigation;
    emit: (type: NavigationEvent) => void;
};

export function createTestNavigation (): TestNavigationHandle {
    const listeners: Record<NavigationEvent, NavigationListener[]> = {
        focus: [],
        blur: [],
    };

    const navigation: TestNavigation = {
        isFocused: () => true,
        addListener: (type, listener) => {
            listeners[type].push(listener);
            return () => {
                listeners[type] = listeners[type].filter((item) => item !== listener);
            };
        },
    };

    const emit = (type: NavigationEvent): void => {
        [...listeners[type]].forEach((listener) => listener());
    };

    return {
        navigation,
        emit,
    };
}

export type TestNavigationProviderProps = {
    navigation: TestNavigation;
    children?: React.ReactNode;
};

export function TestNavigationProvider ({ navigation, children }: TestNavigationProviderProps): React.JSX.Element {
    return React.createElement(
        NavigationContext.Provider,
        { value: navigation as unknown as NavigationProp<ParamListBase> },
        children
    );
}
