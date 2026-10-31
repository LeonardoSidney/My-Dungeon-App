import { act, renderHook } from '@testing-library/react-native';
import { useSceneContextEnabled } from '@presentation/screens/settings/useSceneContextEnabled';

function buildParams (overrides: Partial<Parameters<typeof useSceneContextEnabled>[0]> = {}) {
    return {
        getSceneContextEnabled: { handle: jest.fn().mockResolvedValue({ success: true, sceneContextEnabled: true }) },
        saveSceneContextEnabled: { handle: jest.fn().mockResolvedValue({ success: true, sceneContextEnabled: false }) },
        alert: { handle: jest.fn() },
        ...overrides,
    };
}

async function renderLoaded (params = buildParams()) {
    const rendered = await renderHook(() => useSceneContextEnabled(params));
    await act(async () => {});
    return rendered;
}

describe('useSceneContextEnabled', () => {
    it('loads the saved setting', async () => {
        const { result } = await renderLoaded();

        expect(result.current.sceneContextEnabled).toBe(true);
    });

    it('keeps the scene context off when the setting cannot be loaded', async () => {
        const params = buildParams({ getSceneContextEnabled: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to load settings' }) } });

        const { result } = await renderLoaded(params);

        expect(result.current.sceneContextEnabled).toBe(false);
    });

    it('saves the new setting', async () => {
        const params = buildParams();
        const { result } = await renderLoaded(params);

        await act(async () => { await result.current.changeSceneContextEnabled(false); });

        expect(params.saveSceneContextEnabled.handle).toHaveBeenCalledWith({ sceneContextEnabled: false });
        expect(result.current.sceneContextEnabled).toBe(false);
    });

    it('reverts the setting and alerts when the save fails', async () => {
        const params = buildParams({
            saveSceneContextEnabled: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to save settings' }) },
        });
        const { result } = await renderLoaded(params);

        await act(async () => { await result.current.changeSceneContextEnabled(false); });

        expect(result.current.sceneContextEnabled).toBe(true);
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Failed to save settings' });
    });
});
