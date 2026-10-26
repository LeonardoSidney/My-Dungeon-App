import { handleDraftUpdate, saveDraftEdit, toggleDraftCompletion } from '@presentation/screens/playground/draftActions';

describe('handleDraftUpdate', () => {
    function buildParams (update: { isStreaming: boolean; error?: string; }) {
        return {
            update,
            reloadDraft: jest.fn().mockResolvedValue(undefined),
            setIsStreaming: jest.fn(),
            alert: { handle: jest.fn() }
        };
    }

    it('reloads the draft and follows the streaming state', async () => {
        const params = buildParams({ isStreaming: true });

        await handleDraftUpdate(params);

        expect(params.setIsStreaming).toHaveBeenCalledWith(true);
        expect(params.reloadDraft).toHaveBeenCalled();
        expect(params.alert.handle).not.toHaveBeenCalled();
    });

    it('alerts with the error the backend reported', async () => {
        const params = buildParams({ isStreaming: false, error: 'Request failed with status 500' });

        await handleDraftUpdate(params);

        expect(params.setIsStreaming).toHaveBeenCalledWith(false);
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Request failed with status 500' });
        expect(params.reloadDraft).toHaveBeenCalled();
    });
});

describe('toggleDraftCompletion', () => {
    function buildParams (isStreaming: boolean) {
        return {
            draftId: 'home',
            prompt: 'Once',
            isStreaming,
            startDraftCompletion: { handle: jest.fn().mockResolvedValue({ success: true }) },
            stopDraftCompletion: { handle: jest.fn().mockReturnValue({ success: true }) },
            alert: { handle: jest.fn() }
        };
    }

    it('asks the backend to start a completion with the current text', async () => {
        const params = buildParams(false);

        await toggleDraftCompletion(params);

        expect(params.startDraftCompletion.handle).toHaveBeenCalledWith({ draftId: 'home', prompt: 'Once' });
        expect(params.stopDraftCompletion.handle).not.toHaveBeenCalled();
    });

    it('asks the backend to stop while streaming', async () => {
        const params = buildParams(true);

        await toggleDraftCompletion(params);

        expect(params.stopDraftCompletion.handle).toHaveBeenCalledWith({ draftId: 'home' });
        expect(params.startDraftCompletion.handle).not.toHaveBeenCalled();
    });

    it('alerts when the backend refuses to start', async () => {
        const params = buildParams(false);
        params.startDraftCompletion.handle.mockResolvedValue({ success: false, error: 'No loaded model found on any connection' });

        await toggleDraftCompletion(params);

        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'No loaded model found on any connection' });
    });
});

describe('saveDraftEdit', () => {
    it('saves the edited text through the backend', async () => {
        const saveDraft = { handle: jest.fn().mockResolvedValue({ success: true }) };
        const alert = { handle: jest.fn() };

        await saveDraftEdit({ draftId: 'home', content: 'edited', saveDraft, alert });

        expect(saveDraft.handle).toHaveBeenCalledWith({ draftId: 'home', content: 'edited' });
        expect(alert.handle).not.toHaveBeenCalled();
    });

    it('alerts when the draft cannot be saved', async () => {
        const saveDraft = { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to save draft' }) };
        const alert = { handle: jest.fn() };

        await saveDraftEdit({ draftId: 'home', content: 'edited', saveDraft, alert });

        expect(alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Failed to save draft' });
    });
});
