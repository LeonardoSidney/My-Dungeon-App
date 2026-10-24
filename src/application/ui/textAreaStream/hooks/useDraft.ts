import { useCallback, useEffect, useState } from 'react';
import { createLatestRequestGuard } from '@application/ui/shared/createLatestRequestGuard';
import { handleDraftUpdate } from '../handleDraftUpdate';
import { UseDraftParams } from '../constants';

export function useDraft ({ draftId, getDraft, subscribeDraft, setPrompt, alert }: UseDraftParams) {
    const [isStreaming, setIsStreaming] = useState(false);
    const [guard] = useState(createLatestRequestGuard);

    const reloadDraft = useCallback(async (): Promise<void> => {
        const request = guard.next();
        const response = await getDraft.handle({ draftId });
        if (!response.success) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to load the draft' });
            return;
        }

        if (response.draft && guard.claim(request)) {
            setPrompt(response.draft.content);
        }
    }, [draftId, getDraft, setPrompt, alert, guard]);

    useEffect(() => {
        const response = subscribeDraft.handle({
            draftId,
            onUpdate: update => {
                handleDraftUpdate({ update, reloadDraft, setIsStreaming, alert });
            },
        });

        if (!response.success || !response.unsubscribe) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to listen for draft updates' });
            return;
        }

        setIsStreaming(Boolean(response.isStreaming));
        reloadDraft();
        return response.unsubscribe;
    }, [draftId, subscribeDraft, reloadDraft, alert]);

    return { isStreaming };
}
