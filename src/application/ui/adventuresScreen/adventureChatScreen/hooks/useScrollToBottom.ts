import { useCallback } from 'react';
import { UseScrollToBottomParams } from './constants';

export function useScrollToBottom ({ scrollViewRef, setIsScrollingProgrammatically }: UseScrollToBottomParams) {
    const scrollToBottom = useCallback(() => {
        setIsScrollingProgrammatically(true);

        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
            setIsScrollingProgrammatically(false);
        });
    }, [scrollViewRef, setIsScrollingProgrammatically]);

    return { scrollToBottom };
}
