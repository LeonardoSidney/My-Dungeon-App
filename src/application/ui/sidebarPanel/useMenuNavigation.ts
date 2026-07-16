import { SidebarRoute } from '@application/ui/sidebarPanel/SidebarPanel';

export function useMenuNavigation(onRouteChange?: (route: SidebarRoute) => void) {
    const handleMenuPress = (id: SidebarRoute) => {
        onRouteChange?.(id);
    };

    return { handleMenuPress };
}
