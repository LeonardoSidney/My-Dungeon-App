import type { SidebarRoute } from '@presentation/sidebarPanel';

export type RootParamList = {
    [Route in SidebarRoute]: undefined;
};
