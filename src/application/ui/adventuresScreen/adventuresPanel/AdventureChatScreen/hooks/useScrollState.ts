import { useState } from 'react';

export interface ScrollState {
    isAtBottom: boolean;
    isScrollingProgrammatically: boolean;
    lastContentHeight: number;
}

export function useScrollState () {
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isScrollingProgrammatically, setIsScrollingProgrammatically] = useState(false);
    const [lastContentHeight, setLastContentHeight] = useState(0);

    return {
        isAtBottom,
        setIsAtBottom,
        isScrollingProgrammatically,
        setIsScrollingProgrammatically,
        lastContentHeight,
        setLastContentHeight,
    };
}
