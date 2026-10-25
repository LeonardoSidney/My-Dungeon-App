import { act, renderHook } from '@testing-library/react-native';
import { useWorldMasterPicker } from '@presentation/screens/adventures/settings/useWorldMasterPicker';

function buildParams (overrides: Partial<Parameters<typeof useWorldMasterPicker>[0]> = {}) {
    return {
        adventureId: 'adventure-1',
        currentWorldMasterId: 'wm-1',
        onChange: jest.fn().mockResolvedValue(undefined),
        getWorldMasters: {
            handle: jest.fn().mockResolvedValue({
                success: true,
                items: [
                    { id: 'wm-1', name: 'Current', activationWord: 'a' },
                    { id: 'wm-2', name: 'Other', activationWord: 'b' },
                ],
            }),
        },
        setAdventureWorldMaster: { handle: jest.fn().mockResolvedValue({ success: true }) },
        alert: { handle: jest.fn() },
        ...overrides,
    };
}

describe('useWorldMasterPicker', () => {
    it('offers every other world master returned by the backend', async () => {
        const params = buildParams();
        const { result } = await renderHook(() => useWorldMasterPicker(params));

        await act(async () => {
            await result.current.loadCandidates();
        });

        expect(result.current.candidates).toEqual([{ id: 'wm-2', name: 'Other' }]);
    });

    it('alerts and offers nothing when the backend fails', async () => {
        const params = buildParams({ getWorldMasters: { handle: jest.fn().mockResolvedValue({ success: false, error: 'offline' }) } });
        const { result } = await renderHook(() => useWorldMasterPicker(params));

        await act(async () => {
            await result.current.loadCandidates();
        });

        expect(result.current.candidates).toBeNull();
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'offline' });
    });

    it('saves the chosen world master, closes the list and notifies the screen', async () => {
        const params = buildParams();
        const { result } = await renderHook(() => useWorldMasterPicker(params));

        await act(async () => { result.current.toggle(); });
        await act(async () => {
            await result.current.select({ id: 'wm-2', name: 'Other' });
        });

        expect(params.setAdventureWorldMaster.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', worldMasterId: 'wm-2' });
        expect(result.current.isOpen).toBe(false);
        expect(params.onChange).toHaveBeenCalled();
    });
});
