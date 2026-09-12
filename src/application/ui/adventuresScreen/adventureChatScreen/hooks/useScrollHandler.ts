import { useCallback } from 'react';
import { ScrollEvent } from '../constants';
import { UseScrollHandlerParams } from './constants';

export function useScrollHandler ({
    isAtBottom,
    isScrollingProgrammatically,
    lastContentHeight,
    setIsAtBottom,
    setIsScrollingProgrammatically,
    setLastContentHeight,
    onShowScrollButton,
}: UseScrollHandlerParams) {
    const handleScroll = useCallback((event: ScrollEvent) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
        const isAtBottomCurrent = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

        if (isScrollingProgrammatically) {
            if (isAtBottomCurrent) {
                setIsScrollingProgrammatically(false);
            }
            return;
        }

        const contentGrew = contentSize.height > lastContentHeight;
        if (contentGrew) {
            setLastContentHeight(contentSize.height);
            return;
        }

        if (isAtBottom !== isAtBottomCurrent) {
            setIsAtBottom(isAtBottomCurrent);
            onShowScrollButton(!isAtBottomCurrent);
        }
    }, [isAtBottom, isScrollingProgrammatically, lastContentHeight, setIsAtBottom, setIsScrollingProgrammatically, setLastContentHeight, onShowScrollButton]);

    return { handleScroll };
}
