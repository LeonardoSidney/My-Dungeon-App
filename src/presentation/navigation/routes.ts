import {
    ABILITY_STORAGE_NAMESPACE,
    ADVENTURE_STORAGE_NAMESPACE,
    ASSISTANT_STORAGE_NAMESPACE,
    CHARACTER_STORAGE_NAMESPACE,
    COLLECTION_LABELS,
    ITEM_STORAGE_NAMESPACE,
    LOCATION_STORAGE_NAMESPACE,
    PROFICIENCY_STORAGE_NAMESPACE,
    SAMPLER_STORAGE_NAMESPACE,
    STATUS_STORAGE_NAMESPACE,
    SYSTEM_PROMPT_STORAGE_NAMESPACE,
    WORLD_MASTER_STORAGE_NAMESPACE,
    WORLD_STORAGE_NAMESPACE,
} from '@domain/constants/general';

export type MenuRoute =
    | 'home'
    | 'playground'
    | 'adventures'
    | 'characters'
    | 'abilities'
    | 'statuses'
    | 'items'
    | 'locations'
    | 'systemPrompts'
    | 'proficiencies'
    | 'assistants'
    | 'samplers'
    | 'worldMasters'
    | 'worlds'
    | 'settings';

type AdventureRouteParams = { adventureId: string; };

export type RootParamList = { [Route in MenuRoute]: undefined; } & {
    adventureChat: AdventureRouteParams;
    adventureSettings: AdventureRouteParams;
    adventurePrompt: AdventureRouteParams;
};

export type RootRoute = keyof RootParamList;

export type MenuItem = {
    id: MenuRoute;
    label: string;
};

export const menuItems: MenuItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'adventures', label: COLLECTION_LABELS[ADVENTURE_STORAGE_NAMESPACE] },
    { id: 'characters', label: COLLECTION_LABELS[CHARACTER_STORAGE_NAMESPACE] },
    { id: 'abilities', label: COLLECTION_LABELS[ABILITY_STORAGE_NAMESPACE] },
    { id: 'statuses', label: COLLECTION_LABELS[STATUS_STORAGE_NAMESPACE] },
    { id: 'items', label: COLLECTION_LABELS[ITEM_STORAGE_NAMESPACE] },
    { id: 'locations', label: COLLECTION_LABELS[LOCATION_STORAGE_NAMESPACE] },
    { id: 'systemPrompts', label: COLLECTION_LABELS[SYSTEM_PROMPT_STORAGE_NAMESPACE] },
    { id: 'proficiencies', label: COLLECTION_LABELS[PROFICIENCY_STORAGE_NAMESPACE] },
    { id: 'assistants', label: COLLECTION_LABELS[ASSISTANT_STORAGE_NAMESPACE] },
    { id: 'samplers', label: COLLECTION_LABELS[SAMPLER_STORAGE_NAMESPACE] },
    { id: 'worldMasters', label: COLLECTION_LABELS[WORLD_MASTER_STORAGE_NAMESPACE] },
    { id: 'worlds', label: COLLECTION_LABELS[WORLD_STORAGE_NAMESPACE] },
    { id: 'playground', label: 'Playground' },
    { id: 'settings', label: 'Settings' },
];

const adventureDetailRoutes: ReadonlySet<RootRoute> = new Set(['adventureChat', 'adventureSettings', 'adventurePrompt']);

export function isFullScreenRoute (route: RootRoute): boolean {
    return adventureDetailRoutes.has(route);
}

export function toMenuRoute (route: RootRoute): MenuRoute {
    return adventureDetailRoutes.has(route) ? 'adventures' : route as MenuRoute;
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootParamListBase {}
    }
}

type RootParamListBase = RootParamList;
