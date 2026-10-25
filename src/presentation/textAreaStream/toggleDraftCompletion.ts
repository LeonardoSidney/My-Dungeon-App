import { ToggleDraftCompletionParams } from './constants';

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
            alert.handle({ title: 'Erro', message: stopped.error ?? 'Failed to stop stream completion' });
        }
        return;
    }

    const started = await startDraftCompletion.handle({ draftId, prompt });
    if (!started.success) {
        alert.handle({ title: 'Erro', message: started.error ?? 'Failed to start stream completion' });
    }
}
