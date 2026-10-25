import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { ChatMessageView } from '@domain/controllers';

const BOTTOM_THRESHOLD = 20;

/**
 * Keeps the chat pinned to the bottom while a reply streams, unless the user
 * scrolled up to read; then offers a "scroll to bottom" button instead.
 */
export function useChatAutoScroll (messages: ChatMessageView[]) {
    const scrollViewRef = useRef<ScrollView | null>(null);
    // Refs, not state: these values steer the scroll handler but never change what is rendered.
    const isScrollingProgrammatically = useRef(false);
    const lastContentHeight = useRef(0);
    const previousLastChatId = useRef<string | null>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const scrollToBottom = useCallback(() => {
        isScrollingProgrammatically.current = true;
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
            isScrollingProgrammatically.current = false;
        });
    }, []);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isAtBottomNow = layoutMeasurement.height + contentOffset.y >= contentSize.height - BOTTOM_THRESHOLD;

        if (isScrollingProgrammatically.current) {
            if (isAtBottomNow) {
                isScrollingProgrammatically.current = false;
            }
            return;
        }

        // Growing content (a streaming reply) is not the user scrolling away.
        if (contentSize.height > lastContentHeight.current) {
            lastContentHeight.current = contentSize.height;
            return;
        }

        if (isAtBottomNow !== isAtBottom) {
            setIsAtBottom(isAtBottomNow);
            setShowScrollToBottom(!isAtBottomNow);
        }
    }, [isAtBottom]);

    useEffect(() => {
        const lastChat = messages.length > 0 ? messages[messages.length - 1] : null;
        const lastChatId = lastChat?.id ?? null;
        const replyStarted = Boolean(lastChat?.isStreaming) && previousLastChatId.current !== lastChatId;
        previousLastChatId.current = lastChatId;

        if (replyStarted) {
            setIsAtBottom(true);
            setShowScrollToBottom(false);
            scrollToBottom();
            return;
        }

        if (isAtBottom) {
            scrollToBottom();
        }
    }, [messages, isAtBottom, scrollToBottom]);

    const jumpToBottom = useCallback(() => {
        scrollToBottom();
        setShowScrollToBottom(false);
    }, [scrollToBottom]);

    return { scrollViewRef, showScrollToBottom, handleScroll, jumpToBottom };
}
