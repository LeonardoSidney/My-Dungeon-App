import { useEffect, useState } from 'react';

export function useEditDraft (content: string, isEditing: boolean) {
    const [draft, setDraft] = useState(content);

    useEffect(() => {
        if (isEditing) {
            setDraft(content);
        }
    }, [isEditing, content]);

    return [draft, setDraft] as const;
}
