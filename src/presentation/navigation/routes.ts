export type MenuRoute =
    | 'home'
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
    { id: 'home', label: 'Sandbox' },
    { id: 'adventures', label: 'Adventures' },
    { id: 'characters', label: 'Characters' },
    { id: 'abilities', label: 'Abilities' },
    { id: 'statuses', label: 'Statuses' },
    { id: 'items', label: 'Items' },
    { id: 'locations', label: 'Locations' },
    { id: 'systemPrompts', label: 'System Prompts' },
    { id: 'proficiencies', label: 'Proficiencies' },
    { id: 'assistants', label: 'Assistants' },
    { id: 'samplers', label: 'Samplers' },
    { id: 'worldMasters', label: 'World Masters' },
    { id: 'worlds', label: 'Worlds' },
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
