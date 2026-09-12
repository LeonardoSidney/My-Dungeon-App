import { useState } from 'react';

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
