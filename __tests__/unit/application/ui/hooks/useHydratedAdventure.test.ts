import * as React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Adventure, RoleEnum } from '@domain/entities';
import { HydrateAdventureServiceResponse } from '@domain/services';
import { useHydratedAdventure } from '@application/ui/adventuresScreen/adventureChatScreen/hooks/useHydratedAdventure';
import {
    createAdventureHelper,
    createHydratedAdventureHelper,
    createTestNavigation,
    TestNavigationProvider
} from '@test/helpers';

function createHydrateAdventureController (responses: HydrateAdventureServiceResponse[]) {
    const handle = jest.fn();
    for (const response of responses) {
        handle.mockResolvedValueOnce(response);
    }
    return { handle };
}

function createNavigationWrapper (navigation: ReturnType<typeof createTestNavigation>['navigation']) {
    return (props: { children?: React.ReactNode; }) =>
        React.createElement(TestNavigationProvider, { navigation }, props.children);
}

describe('useHydratedAdventure', () => {
    it('hydrates the adventure on mount', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({ adventure });
        const hydrateAdventure = createHydrateAdventureController([
            { success: true, hydrated }
        ]);
        const { navigation } = createTestNavigation();

        const { result } = await renderHook(
            () => useHydratedAdventure({ adventure, hydrateAdventure }),
            { wrapper: createNavigationWrapper(navigation) }
        );

        await waitFor(() => expect(result.current.hydrated).toBe(hydrated));
        expect(result.current.hydratedRef.current).toBe(hydrated);
        expect(hydrateAdventure.handle).toHaveBeenCalledTimes(1);
        expect(hydrateAdventure.handle).toHaveBeenCalledWith({ adventure });
    });

    it('does not rehydrate when only the chat changes', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({ adventure });
        const hydrateAdventure = createHydrateAdventureController([
            { success: true, hydrated }
        ]);
        const { navigation } = createTestNavigation();

        const { result, rerender } = await renderHook(
            (currentAdventure: Adventure) => useHydratedAdventure({ adventure: currentAdventure, hydrateAdventure }),
            { initialProps: adventure, wrapper: createNavigationWrapper(navigation) }
        );

        await waitFor(() => expect(result.current.hydrated).toBe(hydrated));

        const now = new Date();
        const chatOnly = {
            ...adventure,
            chat: [{
                id: 'chat-1',
                role: RoleEnum.USER,
                index: 0,
                thinkIndex: 0,
                content: ['hello'],
                characterId: '1',
                createdAt: now,
                updatedAt: now
            }]
        };
        await rerender(chatOnly);

        await act(async () => { });

        expect(hydrateAdventure.handle).toHaveBeenCalledTimes(1);
        expect(result.current.hydrated).toBe(hydrated);
    });

    it('rehydrates when a structural field changes', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({ adventure });
        const newAdventure = { ...adventure, worldMasterId: '2' };
        const newHydrated = createHydratedAdventureHelper({ adventure: newAdventure });
        const hydrateAdventure = createHydrateAdventureController([
            { success: true, hydrated },
            { success: true, hydrated: newHydrated }
        ]);
        const { navigation } = createTestNavigation();

        const { result, rerender } = await renderHook(
            (currentAdventure: Adventure) => useHydratedAdventure({ adventure: currentAdventure, hydrateAdventure }),
            { initialProps: adventure, wrapper: createNavigationWrapper(navigation) }
        );

        await waitFor(() => expect(result.current.hydrated).toBe(hydrated));

        await rerender(newAdventure);

        await waitFor(() => expect(result.current.hydrated).toBe(newHydrated));
        expect(hydrateAdventure.handle).toHaveBeenCalledTimes(2);
        expect(hydrateAdventure.handle).toHaveBeenLastCalledWith({ adventure: newAdventure });
    });

    it('ignores a stale hydration response after the adventure changed', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const newAdventure = { ...adventure, worldMasterId: '2' };
        const staleHydrated = createHydratedAdventureHelper({ adventure });
        const freshHydrated = createHydratedAdventureHelper({ adventure: newAdventure });

        let resolveStale: (value: HydrateAdventureServiceResponse) => void = () => {
            return;
        };
        const stalePromise = new Promise<HydrateAdventureServiceResponse>((resolve) => {
            resolveStale = resolve;
        });
        const hydrateAdventure = {
            handle: jest.fn()
                .mockReturnValueOnce(stalePromise)
                .mockResolvedValue({ success: true, hydrated: freshHydrated })
        };
        const { navigation } = createTestNavigation();

        const { result, rerender } = await renderHook(
            (currentAdventure: Adventure) => useHydratedAdventure({ adventure: currentAdventure, hydrateAdventure }),
            { initialProps: adventure, wrapper: createNavigationWrapper(navigation) }
        );

        await rerender(newAdventure);

        await act(async () => {
            resolveStale({ success: true, hydrated: staleHydrated });
        });

        await waitFor(() => expect(result.current.hydrated).toBe(freshHydrated));
        expect(result.current.hydrated).not.toBe(staleHydrated);
    });

    it('refetches the hydration when the screen regains focus', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const staleHydrated = createHydratedAdventureHelper({ adventure, connectionId: 'conn-llamacpp', modelId: 'model-8080' });
        const freshHydrated = createHydratedAdventureHelper({ adventure, connectionId: 'conn-llamacpp2', modelId: 'model-9931' });
        const hydrateAdventure = createHydrateAdventureController([
            { success: true, hydrated: staleHydrated },
            { success: true, hydrated: freshHydrated }
        ]);
        const { navigation, emit } = createTestNavigation();

        const { result } = await renderHook(
            () => useHydratedAdventure({ adventure, hydrateAdventure }),
            { wrapper: createNavigationWrapper(navigation) }
        );

        await waitFor(() => expect(result.current.hydrated).toBe(staleHydrated));

        await act(async () => {
            emit('blur');
            emit('focus');
        });

        await waitFor(() => expect(result.current.hydrated).toBe(freshHydrated));
        expect(result.current.hydratedRef.current).toBe(freshHydrated);
        expect(hydrateAdventure.handle).toHaveBeenCalledTimes(2);
        expect(hydrateAdventure.handle).toHaveBeenLastCalledWith({ adventure });
    });

    it('keeps the current hydration while a focus refetch is in flight', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const currentHydrated = createHydratedAdventureHelper({ adventure });
        const hydratedAfterRefetch = createHydratedAdventureHelper({ adventure, connectionId: 'conn-llamacpp2' });

        let resolveRefetch: (value: HydrateAdventureServiceResponse) => void = () => {
            return;
        };
        const refetchPromise = new Promise<HydrateAdventureServiceResponse>((resolve) => {
            resolveRefetch = resolve;
        });
        const hydrateAdventure = {
            handle: jest.fn()
                .mockResolvedValueOnce({ success: true, hydrated: currentHydrated })
                .mockReturnValueOnce(refetchPromise)
        };
        const { navigation, emit } = createTestNavigation();

        const { result } = await renderHook(
            () => useHydratedAdventure({ adventure, hydrateAdventure }),
            { wrapper: createNavigationWrapper(navigation) }
        );

        await waitFor(() => expect(result.current.hydrated).toBe(currentHydrated));

        await act(async () => {
            emit('blur');
            emit('focus');
        });

        expect(hydrateAdventure.handle).toHaveBeenCalledTimes(2);
        expect(result.current.hydrated).toBe(currentHydrated);

        await act(async () => {
            resolveRefetch({ success: true, hydrated: hydratedAfterRefetch });
        });

        await waitFor(() => expect(result.current.hydrated).toBe(hydratedAfterRefetch));
    });
});
