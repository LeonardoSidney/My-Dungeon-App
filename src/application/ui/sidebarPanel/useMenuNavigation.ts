import { SidebarRoute } from '@application/ui/sidebarPanel/SidebarPanel';

export function useMenuNavigation(
    onRouteChange?: (route: SidebarRoute) => void,
    onClosePanel?: () => void,
) {
    const handleMenuPress = (id: SidebarRoute) => {
        onRouteChange?.(id);
        onClosePanel?.();
    };

    return { handleMenuPress };
}
