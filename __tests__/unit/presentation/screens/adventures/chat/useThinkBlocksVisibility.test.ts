import { act, renderHook } from '@testing-library/react-native';
import { useThinkBlocksVisibility } from '@presentation/screens/adventures/chat/hooks/useThinkBlocksVisibility';

function buildParams (overrides: Partial<Parameters<typeof useThinkBlocksVisibility>[0]> = {}) {
    return {
        getThinkBlocksVisibility: { handle: jest.fn().mockResolvedValue({ success: true, showThinkBlocks: false }) },
        saveThinkBlocksVisibility: { handle: jest.fn().mockResolvedValue({ success: true, showThinkBlocks: true }) },
        alert: { handle: jest.fn() },
        ...overrides,
    };
}

async function renderLoaded (params = buildParams()) {
    const rendered = await renderHook(() => useThinkBlocksVisibility(params));
    await act(async () => {});
    return rendered;
}

describe('useThinkBlocksVisibility', () => {
    it('loads the saved visibility', async () => {
        const { result } = await renderLoaded();

        expect(result.current.showThinkBlocks).toBe(false);
    });

    it('keeps the think blocks visible when the visibility cannot be loaded', async () => {
        const params = buildParams({ getThinkBlocksVisibility: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to load settings' }) } });

        const { result } = await renderLoaded(params);

        expect(result.current.showThinkBlocks).toBe(true);
    });

    it('saves the new visibility', async () => {
        const params = buildParams();
        const { result } = await renderLoaded(params);

        await act(async () => { await result.current.changeThinkBlocksVisibility(true); });

        expect(params.saveThinkBlocksVisibility.handle).toHaveBeenCalledWith({ showThinkBlocks: true });
        expect(result.current.showThinkBlocks).toBe(true);
    });

    it('reverts the visibility and alerts when the save fails', async () => {
        const params = buildParams({
            saveThinkBlocksVisibility: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to save settings' }) },
        });
        const { result } = await renderLoaded(params);

        await act(async () => { await result.current.changeThinkBlocksVisibility(true); });

        expect(result.current.showThinkBlocks).toBe(false);
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Failed to save settings' });
    });
});
