import { useCallback, useRef, useState } from 'react';

export const useThinkEditing = () => {
    const editingThinkChatIdRef = useRef<string | null>(null);
    const [isThinkEditing, setIsThinkEditing] = useState(false);

    const onStartThinkEdit = useCallback((chatId: string) => {
        if (!chatId) return;

        editingThinkChatIdRef.current = chatId;
        setIsThinkEditing(true);
    }, []);

    const clearThinkEditing = useCallback(() => {
        editingThinkChatIdRef.current = null;
        setIsThinkEditing(false);
    }, []);

    return { editingThinkChatIdRef, isThinkEditing, onStartThinkEdit, clearThinkEditing };
};
