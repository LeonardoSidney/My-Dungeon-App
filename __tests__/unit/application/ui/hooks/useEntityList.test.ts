import * as React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useEntityList } from '@application/ui/hooks';
import { createTestNavigation, TestNavigationProvider } from '@test/helpers';

type TestEntity = {
    id: string;
    name: string;
};

type ListResponse = { success: boolean; items?: TestEntity[]; error?: string; };

const LOADED: TestEntity[] = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
];

function ok (items: TestEntity[]): ListResponse {
    return { success: true, items };
}

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
        let resolveFetch: (value: ListResponse) => void = () => {
            return;
        };
        const fetch = jest.fn().mockImplementation(
            () => new Promise<ListResponse>((resolve) => {
                resolveFetch = resolve;
            })
        );
        const { view } = await renderList(fetch);

        expect(view.result.current.isLoading).toBe(true);

        await act(async () => {
            resolveFetch(ok(LOADED));
        });

        await waitFor(() => expect(view.result.current.isLoading).toBe(false));
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(view.result.current.items).toEqual(LOADED);
        expect(view.result.current.isError).toBe(false);
    });

    it('marks the list as errored when fetch fails and recovers on reload', async () => {
        const fetch = jest.fn()
            .mockResolvedValueOnce({ success: false, error: 'boom' })
            .mockResolvedValue(ok(LOADED));
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
            .mockResolvedValueOnce(ok(LOADED))
            .mockResolvedValueOnce(ok(LOADED.slice(0, 1)));
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
            .mockResolvedValueOnce(ok(LOADED))
            .mockResolvedValueOnce(ok(LOADED.slice(0, 1)));
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

    it('marks the list as errored when the backend answers with an error envelope', async () => {
        const fetch = jest.fn().mockResolvedValue({ success: false, error: 'storage offline' });
        const { view } = await renderList(fetch);

        await waitFor(() => expect(view.result.current.isError).toBe(true));
        expect(view.result.current.items).toEqual([]);
    });
});
