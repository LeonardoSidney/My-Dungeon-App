import type { SidebarRoute } from '@application/ui/sidebarPanel';

export type RootParamList = {
    [Route in SidebarRoute]: undefined;
};
