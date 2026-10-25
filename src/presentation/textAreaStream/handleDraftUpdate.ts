import { HandleDraftUpdateParams } from './constants';

export async function handleDraftUpdate ({ update, reloadDraft, setIsStreaming, alert }: HandleDraftUpdateParams): Promise<void> {
    setIsStreaming(update.isStreaming);

    if (update.error) {
        alert.handle({ title: 'Erro', message: update.error });
    }

    await reloadDraft();
}
