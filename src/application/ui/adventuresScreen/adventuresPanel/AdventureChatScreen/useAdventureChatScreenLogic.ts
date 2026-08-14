import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { Adventure } from '@domain/entities';
import { useScrollState } from './hooks/useScrollState';
import { useScrollToBottom } from './hooks/useScrollToBottom';
import { useScrollHandler } from './hooks/useScrollHandler';

export function useAdventureChatScreenLogic (currentAdventure: Adventure) {
    const scrollViewRef = useRef<ScrollView | null>(null);
    const { isAtBottom, setIsAtBottom, isScrollingProgrammatically, setIsScrollingProgrammatically, lastContentHeight, setLastContentHeight } = useScrollState();
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const { scrollToBottom } = useScrollToBottom({
        scrollViewRef,
        setIsScrollingProgrammatically,
    });

    const { handleScroll } = useScrollHandler({
        isAtBottom,
        isScrollingProgrammatically,
        lastContentHeight,
        setIsAtBottom,
        setIsScrollingProgrammatically,
        setLastContentHeight,
        onShowScrollButton: setShowScrollToBottom,
    });

    const handleScrollToBottom = useCallback(() => {
        scrollToBottom();
        setShowScrollToBottom(false);
    }, [scrollToBottom]);

    const previousStreamingChatIdRef = useRef<string | null>(null);

    useEffect(() => {
        const lastChat = currentAdventure.chat.length > 0
            ? currentAdventure.chat[currentAdventure.chat.length - 1]
            : null;
        const isStreaming = lastChat?.isStreaming ?? false;
        const currentChatId = lastChat?.id ?? null;

        const prevId = previousStreamingChatIdRef.current;
        const streamingStarted = isStreaming && prevId !== currentChatId;

        previousStreamingChatIdRef.current = currentChatId;

        if (streamingStarted) {
            setIsAtBottom(true);
            setShowScrollToBottom(false);
            scrollToBottom();
            return;
        }

        if (isAtBottom) {
            scrollToBottom();
        }
    }, [currentAdventure.chat, scrollToBottom, isAtBottom, setIsAtBottom]);

    return {
        scrollViewRef,
        showScrollToBottom,
        handleScroll,
        scrollToBottom,
        handleScrollToBottom,
    };
}
