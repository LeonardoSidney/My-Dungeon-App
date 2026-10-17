import * as React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useEntityList } from '@application/ui/hooks';
import { createTestNavigation, TestNavigationProvider } from '@test/helpers';

type TestEntity = {
    id: string;
    name: string;
};

const LOADED: TestEntity[] = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
];

async function renderList (fetch: jest.Mock) {
    const navigation = createTestNavigation();
    const view = await renderHook(
        () => useEntityList<TestEntity>({ fetch }),
        { wrapper: (props) => React.createElement(TestNavigationProvider, { navigation: navigation.navigation }, props.children) }
    );
    return { view, navigation };
}

describe('useEntityList', () => {
    it('loads items on mount and clears the loading flag', async () => {
        let resolveFetch: (value: TestEntity[]) => void = () => {
            return;
        };
        const fetch = jest.fn().mockImplementation(
            () => new Promise<TestEntity[]>((resolve) => {
                resolveFetch = resolve;
            })
        );
        const { view } = await renderList(fetch);

        expect(view.result.current.isLoading).toBe(true);

        await act(async () => {
            resolveFetch(LOADED);
        });

        await waitFor(() => expect(view.result.current.isLoading).toBe(false));
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(view.result.current.items).toEqual(LOADED);
        expect(view.result.current.isError).toBe(false);
    });

    it('marks the list as errored when fetch fails and recovers on reload', async () => {
        const fetch = jest.fn()
            .mockRejectedValueOnce(new Error('boom'))
            .mockResolvedValue(LOADED);
        const { view } = await renderList(fetch);

        await waitFor(() => expect(view.result.current.isError).toBe(true));
        expect(view.result.current.isLoading).toBe(false);
        expect(view.result.current.items).toEqual([]);

        await act(async () => {
            await view.result.current.reload();
        });
        await waitFor(() => expect(view.result.current.isError).toBe(false));
        expect(view.result.current.items).toEqual(LOADED);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('refetches the latest items on reload', async () => {
        const fetch = jest.fn()
            .mockResolvedValueOnce(LOADED)
            .mockResolvedValueOnce(LOADED.slice(0, 1));
        const { view } = await renderList(fetch);
        await waitFor(() => expect(view.result.current.isLoading).toBe(false));

        await act(async () => {
            await view.result.current.reload();
        });
        await waitFor(() => expect(view.result.current.items).toHaveLength(1));
        expect(view.result.current.items).toEqual(LOADED.slice(0, 1));
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('refetches the latest items when the screen regains focus', async () => {
        const fetch = jest.fn()
            .mockResolvedValueOnce(LOADED)
            .mockResolvedValueOnce(LOADED.slice(0, 1));
        const { view, navigation } = await renderList(fetch);
        await waitFor(() => expect(view.result.current.isLoading).toBe(false));

        await act(async () => {
            navigation.emit('blur');
            navigation.emit('focus');
        });

        await waitFor(() => expect(view.result.current.items).toHaveLength(1));
        expect(view.result.current.items).toEqual(LOADED.slice(0, 1));
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
