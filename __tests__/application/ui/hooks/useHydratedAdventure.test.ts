import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Adventure, RoleEnum } from '@domain/entities';
import { HydrateAdventureServiceResponse } from '@domain/services';
import { useHydratedAdventure } from '@application/ui/adventuresScreen/adventureChatScreen/hooks/useHydratedAdventure';
import { createAdventureHelper, createHydratedAdventureHelper } from '@test/helpers';

function createHydrateAdventureController (responses: HydrateAdventureServiceResponse[]) {
    const handle = jest.fn();
    for (const response of responses) {
        handle.mockResolvedValueOnce(response);
    }
    return { handle };
}

describe('useHydratedAdventure', () => {
    it('hydrates the adventure on mount', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({ adventure });
        const hydrateAdventure = createHydrateAdventureController([
            { success: true, hydrated }
        ]);

        const { result } = await renderHook(() => useHydratedAdventure({ adventure, hydrateAdventure }));

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

        const { result, rerender } = await renderHook(
            (currentAdventure: Adventure) => useHydratedAdventure({ adventure: currentAdventure, hydrateAdventure }),
            { initialProps: adventure }
        );

        await waitFor(() => expect(result.current.hydrated).toBe(hydrated));

        const now = new Date();
        const chatOnly = {
            ...adventure,
            chat: [{
                id: 'chat-1',
                role: RoleEnum.USER,
                index: 0,
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

        const { result, rerender } = await renderHook(
            (currentAdventure: Adventure) => useHydratedAdventure({ adventure: currentAdventure, hydrateAdventure }),
            { initialProps: adventure }
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

        const { result, rerender } = await renderHook(
            (currentAdventure: Adventure) => useHydratedAdventure({ adventure: currentAdventure, hydrateAdventure }),
            { initialProps: adventure }
        );

        await rerender(newAdventure);

        await act(async () => {
            resolveStale({ success: true, hydrated: staleHydrated });
        });

        await waitFor(() => expect(result.current.hydrated).toBe(freshHydrated));
        expect(result.current.hydrated).not.toBe(staleHydrated);
    });
});
