import type { Character, Item, Location, SystemPrompt, World, WorldMaster } from '@domain/entities';
import type { AppControllers } from '@application/ui/providers/appControllers';
import type { AdventuresFormOptionErrors } from './adventuresForm';
import { useEntityList } from '@application/ui/hooks';
import type { UseEntityListReturn } from '@application/ui/hooks';

export type AdventureFormOptions = {
    characters: UseEntityListReturn<Character>;
    systemPrompts: UseEntityListReturn<SystemPrompt>;
    worldMasters: UseEntityListReturn<WorldMaster>;
    worlds: UseEntityListReturn<World>;
    locations: UseEntityListReturn<Location>;
    items: UseEntityListReturn<Item>;
    optionErrors: AdventuresFormOptionErrors;
};

export function useAdventureFormOptions (controllers: AppControllers): AdventureFormOptions {
    const characters = useEntityList({ fetch: () => controllers.getCharacters.handle() });
    const systemPrompts = useEntityList({ fetch: () => controllers.getSystemPrompts.handle() });
    const worldMasters = useEntityList({ fetch: () => controllers.getWorldMasters.handle() });
    const worlds = useEntityList({ fetch: () => controllers.getWorlds.handle() });
    const locations = useEntityList({ fetch: () => controllers.getLocations.handle() });
    const items = useEntityList({ fetch: () => controllers.getItems.handle() });

    const optionErrors: AdventuresFormOptionErrors = {
        systemPrompts: systemPrompts.isError ? 'Failed to load system prompts.' : undefined,
        characters: characters.isError ? 'Failed to load characters.' : undefined,
        worldMasters: worldMasters.isError ? 'Failed to load world masters.' : undefined,
        worlds: worlds.isError ? 'Failed to load worlds.' : undefined,
        locations: locations.isError ? 'Failed to load locations.' : undefined,
        items: items.isError ? 'Failed to load items.' : undefined,
    };

    return {
        characters,
        systemPrompts,
        worldMasters,
        worlds,
        locations,
        items,
        optionErrors,
    };
}
