import { useCallback, useEffect, useState } from 'react';
import { IAlertController, IGetDraftController, ISubscribeDraftController } from '@domain/controllers';
import { createLatestRequestGuard } from '@presentation/utils/createLatestRequestGuard';
import { showError } from '@presentation/utils/showError';
import { handleDraftUpdate } from './draftActions';

type UseDraftParams = {
    draftId: string;
    getDraft: IGetDraftController;
    subscribeDraft: ISubscribeDraftController;
    setPrompt: (content: string) => void;
    alert: IAlertController;
};

/** Keeps the text area in sync with the stored draft while a completion streams into it. */
export function useDraft ({ draftId, getDraft, subscribeDraft, setPrompt, alert }: UseDraftParams) {
    const [isStreaming, setIsStreaming] = useState(false);
    const [guard] = useState(createLatestRequestGuard);

    const reloadDraft = useCallback(async (): Promise<void> => {
        const request = guard.next();
        const response = await getDraft.handle({ draftId });
        if (!response.success) {
            showError(alert, response.error, 'Failed to load the draft');
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
            showError(alert, response.error, 'Failed to listen for draft updates');
            return;
        }

        setIsStreaming(Boolean(response.isStreaming));
        reloadDraft();
        return response.unsubscribe;
    }, [draftId, subscribeDraft, reloadDraft, alert]);

    return { isStreaming };
}
