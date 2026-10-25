import { act, renderHook } from '@testing-library/react-native';
import { useSystemPromptLoadOrder } from '@presentation/screens/settings/useSystemPromptLoadOrder';

const DEFAULT_LOAD_ORDER = '{systemPrompt}{worldMaster}{characters}';

function buildParams (overrides: Partial<Parameters<typeof useSystemPromptLoadOrder>[0]> = {}) {
    return {
        getSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: true, loadOrder: '{systemPrompt}{characters}' }) },
        saveSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: true, loadOrder: '{characters}' }) },
        resetSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: true, loadOrder: DEFAULT_LOAD_ORDER }) },
        alert: { handle: jest.fn() },
        ...overrides,
    };
}

async function renderLoaded (params = buildParams()) {
    const rendered = await renderHook(() => useSystemPromptLoadOrder(params));
    await act(async () => {});
    return rendered;
}

describe('useSystemPromptLoadOrder', () => {
    it('loads the current load order into the field', async () => {
        const { result } = await renderLoaded();

        expect(result.current.isLoading).toBe(false);
        expect(result.current.loadOrder).toBe('{systemPrompt}{characters}');
        expect(result.current.loadError).toBeUndefined();
    });

    it('shows the load error when the load order cannot be loaded', async () => {
        const params = buildParams({ getSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to load settings' }) } });

        const { result } = await renderLoaded(params);

        expect(result.current.isLoading).toBe(false);
        expect(result.current.loadError).toBe('Failed to load settings');
    });

    it('saves the typed load order and shows the normalized one returned by the backend', async () => {
        const params = buildParams();
        const { result } = await renderLoaded(params);

        await act(async () => { result.current.changeLoadOrder(' {characters}\n'); });
        await act(async () => { await result.current.save(); });

        expect(params.saveSystemPromptLoadOrder.handle).toHaveBeenCalledWith({ loadOrder: ' {characters}\n' });
        expect(result.current.loadOrder).toBe('{characters}');
        expect(result.current.error).toBeUndefined();
        expect(result.current.isSaving).toBe(false);
    });

    it('keeps the typed text and shows the validation error when the backend rejects it', async () => {
        const params = buildParams({
            saveSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Invalid tag: {abacate}' }) },
        });
        const { result } = await renderLoaded(params);

        await act(async () => { result.current.changeLoadOrder('{systemPrompt}{abacate}'); });
        await act(async () => { await result.current.save(); });

        expect(result.current.loadOrder).toBe('{systemPrompt}{abacate}');
        expect(result.current.error).toBe('Invalid tag: {abacate}');
        expect(params.alert.handle).not.toHaveBeenCalled();
    });

    it('clears the validation error as soon as the text changes', async () => {
        const params = buildParams({
            saveSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Invalid tag: {abacate}' }) },
        });
        const { result } = await renderLoaded(params);

        await act(async () => { await result.current.save(); });
        await act(async () => { result.current.changeLoadOrder('{systemPrompt}'); });

        expect(result.current.error).toBeUndefined();
    });

    it('restores the default load order into the field', async () => {
        const params = buildParams();
        const { result } = await renderLoaded(params);

        await act(async () => { result.current.changeLoadOrder('{characters}'); });
        await act(async () => { await result.current.restoreDefault(); });

        expect(params.resetSystemPromptLoadOrder.handle).toHaveBeenCalled();
        expect(result.current.loadOrder).toBe(DEFAULT_LOAD_ORDER);
        expect(result.current.error).toBeUndefined();
    });

    it('alerts and keeps the field when the restore fails', async () => {
        const params = buildParams({
            resetSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to save settings' }) },
        });
        const { result } = await renderLoaded(params);

        await act(async () => { await result.current.restoreDefault(); });

        expect(result.current.loadOrder).toBe('{systemPrompt}{characters}');
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Failed to save settings' });
    });

    describe('unsaved changes', () => {
        it('starts with nothing to save once the load order is loaded', async () => {
            const { result } = await renderLoaded();

            expect(result.current.hasUnsavedChanges).toBe(false);
        });

        it('has unsaved changes as soon as the text differs from the saved load order', async () => {
            const { result } = await renderLoaded();

            await act(async () => { result.current.changeLoadOrder('{characters}'); });

            expect(result.current.hasUnsavedChanges).toBe(true);
        });

        it('has nothing to save again when the text is edited back to the saved load order', async () => {
            const { result } = await renderLoaded();

            await act(async () => { result.current.changeLoadOrder('{characters}'); });
            await act(async () => { result.current.changeLoadOrder('{systemPrompt}{characters}'); });

            expect(result.current.hasUnsavedChanges).toBe(false);
        });

        it('counts whitespace as an unsaved change until it is saved and normalized', async () => {
            const { result } = await renderLoaded();

            await act(async () => { result.current.changeLoadOrder(' {characters}\n'); });
            expect(result.current.hasUnsavedChanges).toBe(true);

            await act(async () => { await result.current.save(); });
            expect(result.current.hasUnsavedChanges).toBe(false);
        });

        it('keeps the unsaved changes when the backend rejects the save', async () => {
            const params = buildParams({
                saveSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Invalid tag: {abacate}' }) },
            });
            const { result } = await renderLoaded(params);

            await act(async () => { result.current.changeLoadOrder('{abacate}'); });
            await act(async () => { await result.current.save(); });

            expect(result.current.hasUnsavedChanges).toBe(true);
        });

        it('has nothing to save after restoring the default', async () => {
            const { result } = await renderLoaded();

            await act(async () => { result.current.changeLoadOrder('{characters}'); });
            await act(async () => { await result.current.restoreDefault(); });

            expect(result.current.hasUnsavedChanges).toBe(false);
        });

        it('keeps the unsaved changes when the restore fails', async () => {
            const params = buildParams({
                resetSystemPromptLoadOrder: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to save settings' }) },
            });
            const { result } = await renderLoaded(params);

            await act(async () => { result.current.changeLoadOrder('{characters}'); });
            await act(async () => { await result.current.restoreDefault(); });

            expect(result.current.hasUnsavedChanges).toBe(true);
        });
    });
});
