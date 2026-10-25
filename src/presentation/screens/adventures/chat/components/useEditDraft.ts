import { useEffect, useState } from 'react';

/** Local text of an inline editor, reset to the saved content every time editing starts. */
export function useEditDraft (content: string, isEditing: boolean) {
    const [draft, setDraft] = useState(content);

    useEffect(() => {
        if (isEditing) {
            setDraft(content);
        }
    }, [isEditing, content]);

    return [draft, setDraft] as const;
}
