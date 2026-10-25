import { act, renderHook } from '@testing-library/react-native';
import { usePromptQuery } from '@presentation/adventuresScreen/systemPromptViewer/usePromptQuery';

describe('usePromptQuery', () => {
    it('does not load until the prompt is requested', async () => {
        const load = jest.fn().mockResolvedValue({ success: true, data: 'prompt' });
        const { result } = await renderHook(() => usePromptQuery(load));

        expect(load).not.toHaveBeenCalled();
        expect(result.current.prompt).toBeUndefined();
    });

    it('loads once, even when requested again', async () => {
        const load = jest.fn().mockResolvedValue({ success: true, data: 'prompt' });
        const { result } = await renderHook(() => usePromptQuery(load));

        await act(async () => {
            await result.current.request();
        });
        await act(async () => {
            await result.current.request();
        });

        expect(load).toHaveBeenCalledTimes(1);
        expect(result.current).toEqual(expect.objectContaining({ isLoading: false, prompt: 'prompt' }));
    });

    it('keeps the backend error for the tab', async () => {
        const load = jest.fn().mockResolvedValue({ success: false, error: 'Model did not return a prompt' });
        const { result } = await renderHook(() => usePromptQuery(load));

        await act(async () => {
            await result.current.request();
        });

        expect(result.current).toEqual(expect.objectContaining({ isLoading: false, error: 'Model did not return a prompt' }));
    });
});
