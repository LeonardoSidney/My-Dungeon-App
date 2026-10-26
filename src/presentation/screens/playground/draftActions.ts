import {
    DraftUpdateView,
    IAlertController,
    ISaveDraftController,
    IStartDraftCompletionController,
    IStopDraftCompletionController,
} from '@domain/controllers';
import { showError } from '@presentation/utils/showError';

type HandleDraftUpdateParams = {
    update: DraftUpdateView;
    reloadDraft: () => Promise<void>;
    setIsStreaming: (isStreaming: boolean) => void;
    alert: IAlertController;
};

export async function handleDraftUpdate ({ update, reloadDraft, setIsStreaming, alert }: HandleDraftUpdateParams): Promise<void> {
    setIsStreaming(update.isStreaming);

    if (update.error) {
        showError(alert, update.error, update.error);
    }

    await reloadDraft();
}

type ToggleDraftCompletionParams = {
    draftId: string;
    prompt: string;
    isStreaming: boolean;
    startDraftCompletion: IStartDraftCompletionController;
    stopDraftCompletion: IStopDraftCompletionController;
    alert: IAlertController;
};

export async function toggleDraftCompletion ({
    draftId,
    prompt,
    isStreaming,
    startDraftCompletion,
    stopDraftCompletion,
    alert,
}: ToggleDraftCompletionParams): Promise<void> {
    if (isStreaming) {
        const stopped = stopDraftCompletion.handle({ draftId });
        if (!stopped.success) {
            showError(alert, stopped.error, 'Failed to stop stream completion');
        }
        return;
    }

    const started = await startDraftCompletion.handle({ draftId, prompt });
    if (!started.success) {
        showError(alert, started.error, 'Failed to start stream completion');
    }
}

type SaveDraftEditParams = {
    draftId: string;
    content: string;
    saveDraft: ISaveDraftController;
    alert: IAlertController;
};

export async function saveDraftEdit ({ draftId, content, saveDraft, alert }: SaveDraftEditParams): Promise<void> {
    const response = await saveDraft.handle({ draftId, content });
    if (!response.success) {
        showError(alert, response.error, 'Failed to save the draft');
    }
}
