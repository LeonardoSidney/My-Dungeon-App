import * as React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useFocusedQuery } from '@application/ui/adventuresScreen/adventureChatScreen/hooks/useFocusedQuery';
import { createTestNavigation, TestNavigationProvider } from '@test/helpers';

async function render<T> (load: () => Promise<{ success: boolean; value?: T; error?: string; }>) {
    const navigation = createTestNavigation();
    return renderHook(
        () => useFocusedQuery(load),
        { wrapper: (props) => React.createElement(TestNavigationProvider, { navigation: navigation.navigation }, props.children) }
    );
}

describe('useFocusedQuery', () => {
    it('treats a null value as a loaded answer, not as a failure', async () => {
        const load = jest.fn().mockResolvedValue({ success: true, value: null });
        const { result } = await render(load);

        await waitFor(() => expect(result.current.isLoaded).toBe(true));
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('reports the backend error and stays unloaded', async () => {
        const load = jest.fn().mockResolvedValue({ success: false, error: 'offline' });
        const { result } = await render(load);

        await waitFor(() => expect(result.current.error).toBe('offline'));
        expect(result.current.isLoaded).toBe(false);
    });
});
