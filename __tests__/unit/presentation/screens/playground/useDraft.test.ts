import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DraftUpdateView } from '@domain/controllers';
import { useDraft } from '@presentation/screens/playground/useDraft';

async function setup ({ isStreaming = false, draft = { id: 'home', content: 'stored text' } as { id: string; content: string; } | null } = {}) {
    let onUpdate: (update: DraftUpdateView) => void = () => undefined;
    const unsubscribe = jest.fn();
    const params = {
        draftId: 'home',
        subscribeDraft: {
            handle: jest.fn((request: { onUpdate: (update: DraftUpdateView) => void; }) => {
                onUpdate = request.onUpdate;
                return { success: true, isStreaming, unsubscribe };
            })
        },
        getDraft: { handle: jest.fn().mockResolvedValue({ success: true, draft: draft ?? undefined }) },
        setPrompt: jest.fn(),
        alert: { handle: jest.fn() }
    };

    const hook = await renderHook(() => useDraft(params));

    return { ...hook, params, unsubscribe, emit: (update: DraftUpdateView) => act(async () => { onUpdate(update); }) };
}

describe('useDraft', () => {
    it('loads the saved draft into the text area when it mounts', async () => {
        const { params } = await setup();

        await waitFor(() => expect(params.setPrompt).toHaveBeenCalledWith('stored text'));
        expect(params.getDraft.handle).toHaveBeenCalledWith({ draftId: 'home' });
    });

    it('keeps the current text when no draft was saved yet', async () => {
        const { params } = await setup({ draft: null });

        await waitFor(() => expect(params.getDraft.handle).toHaveBeenCalled());
        expect(params.setPrompt).not.toHaveBeenCalled();
    });

    it('starts as streaming when the backend is already completing the draft', async () => {
        const { result } = await setup({ isStreaming: true });

        expect(result.current.isStreaming).toBe(true);
    });

    it('reloads the draft from the backend on every update', async () => {
        const { result, params, emit } = await setup();
        params.getDraft.handle.mockResolvedValue({ success: true, draft: { id: 'home', content: 'stored text and more' } });

        await emit({ isStreaming: true });

        await waitFor(() => expect(params.setPrompt).toHaveBeenLastCalledWith('stored text and more'));
        expect(result.current.isStreaming).toBe(true);
    });

    it('ignores a slower load that resolves after a newer one', async () => {
        const { params, emit } = await setup();
        await waitFor(() => expect(params.setPrompt).toHaveBeenCalledWith('stored text'));
        let resolveSlow: (value: unknown) => void = () => undefined;
        params.getDraft.handle
            .mockReturnValueOnce(new Promise(resolve => { resolveSlow = resolve; }))
            .mockResolvedValueOnce({ success: true, draft: { id: 'home', content: 'newest' } });

        await emit({ isStreaming: true });
        await emit({ isStreaming: false });
        await waitFor(() => expect(params.setPrompt).toHaveBeenLastCalledWith('newest'));
        await act(async () => { resolveSlow({ success: true, draft: { id: 'home', content: 'stale' } }); });

        expect(params.setPrompt).not.toHaveBeenCalledWith('stale');
    });

    it('stops streaming and alerts when the completion ends with an error', async () => {
        const { result, params, emit } = await setup({ isStreaming: true });

        await emit({ isStreaming: false, error: 'Request failed with status 500' });

        expect(result.current.isStreaming).toBe(false);
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Request failed with status 500' });
    });

    it('unsubscribes when the component unmounts', async () => {
        const { unmount, unsubscribe } = await setup();

        await unmount();

        expect(unsubscribe).toHaveBeenCalled();
    });
});
