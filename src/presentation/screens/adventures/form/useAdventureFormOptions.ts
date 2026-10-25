import { useEntityList } from '@presentation/hooks';
import type { AppControllers } from '@presentation/providers/appControllers';
import type { AdventureOptionLists } from './adventureForm';

export type AdventureOptionErrors = Partial<Record<keyof AdventureOptionLists, string>>;

export type AdventureFormOptions = AdventureOptionLists & {
    errors: AdventureOptionErrors;
};

type OptionControllers = Pick<AppControllers, 'getCharacters' | 'getSystemPrompts' | 'getWorldMasters' | 'getWorlds' | 'getLocations' | 'getItems'>;

export function useAdventureFormOptions (controllers: OptionControllers): AdventureFormOptions {
    const { getCharacters, getSystemPrompts, getWorldMasters, getWorlds, getLocations, getItems } = controllers;
    const characters = useEntityList({ fetch: () => getCharacters.handle() });
    const systemPrompts = useEntityList({ fetch: () => getSystemPrompts.handle() });
    const worldMasters = useEntityList({ fetch: () => getWorldMasters.handle() });
    const worlds = useEntityList({ fetch: () => getWorlds.handle() });
    const locations = useEntityList({ fetch: () => getLocations.handle() });
    const items = useEntityList({ fetch: () => getItems.handle() });

    return {
        characters: characters.items,
        systemPrompts: systemPrompts.items,
        worldMasters: worldMasters.items,
        worlds: worlds.items,
        locations: locations.items,
        items: items.items,
        errors: {
            characters: characters.isError ? 'Failed to load characters.' : undefined,
            systemPrompts: systemPrompts.isError ? 'Failed to load system prompts.' : undefined,
            worldMasters: worldMasters.isError ? 'Failed to load world masters.' : undefined,
            worlds: worlds.isError ? 'Failed to load worlds.' : undefined,
            locations: locations.isError ? 'Failed to load locations.' : undefined,
            items: items.isError ? 'Failed to load items.' : undefined,
        },
    };
}
