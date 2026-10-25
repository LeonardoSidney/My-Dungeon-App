import { SaveDraftEditParams } from './constants';

export async function saveDraftEdit ({ draftId, content, saveDraft, alert }: SaveDraftEditParams): Promise<void> {
    const response = await saveDraft.handle({ draftId, content });
    if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to save the draft' });
    }
}
