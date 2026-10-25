import { act, renderHook } from '@testing-library/react-native';
import { useAddWorldMaster } from '@presentation/adventuresScreen/adventureChatScreen/adventureChatSettings/worldMasterDropdown/hooks/useAddWorldMaster';

describe('useAddWorldMaster', () => {
    it('offers every other world master returned by the backend', async () => {
        const setWorldMasters = jest.fn();
        const startAdding = jest.fn();
        const getWorldMasters = {
            handle: jest.fn().mockResolvedValue({
                success: true,
                items: [
                    { id: 'wm-1', name: 'Current', activationWord: 'a' },
                    { id: 'wm-2', name: 'Other', activationWord: 'b' },
                ],
            }),
        };
        const { result } = await renderHook(() => useAddWorldMaster({ adventureWorldMasterId: 'wm-1', setWorldMasters, startAdding, getWorldMasters }));

        await act(async () => {
            await result.current.handleAddWorldMaster();
        });

        expect(setWorldMasters).toHaveBeenCalledWith([{ id: 'wm-2', name: 'Other' }]);
        expect(startAdding).toHaveBeenCalled();
    });

    it('does not open the list when the backend fails', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const startAdding = jest.fn();
        const getWorldMasters = { handle: jest.fn().mockResolvedValue({ success: false, error: 'offline' }) };
        const { result } = await renderHook(() => useAddWorldMaster({ setWorldMasters: jest.fn(), startAdding, getWorldMasters }));

        await act(async () => {
            await result.current.handleAddWorldMaster();
        });

        expect(startAdding).not.toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
