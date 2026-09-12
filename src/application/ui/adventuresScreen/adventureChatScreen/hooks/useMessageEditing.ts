import { useCallback, useRef, useState } from 'react';

export const useMessageEditing = () => {
    const editingChatIdRef = useRef<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const onStartEdit = useCallback((chatId: string) => {
        if (!chatId) return;

        editingChatIdRef.current = chatId;
        setIsEditing(true);
    }, []);

    const clearEditing = useCallback(() => {
        editingChatIdRef.current = null;
        setIsEditing(false);
    }, []);

    return { editingChatIdRef, isEditing, onStartEdit, clearEditing };
};
