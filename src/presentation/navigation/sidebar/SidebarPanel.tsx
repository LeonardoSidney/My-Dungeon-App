import { ReactNode, useState } from 'react';
import { Animated, Pressable, Text, View, useWindowDimensions } from 'react-native';
import type { MenuItem, MenuRoute } from '../routes';
import { ScreenHeader } from './ScreenHeader';
import { useSidebarAnimation } from './useSidebarAnimation';
import { SIDEBAR_WIDTH, styles } from './SidebarPanel.styles';

const WIDE_SCREEN_MIN_WIDTH = 1280;

type SidebarPanelProps = {
  children: ReactNode;
  menuItems: MenuItem[];
  activeRoute: MenuRoute;
  onRouteChange: (route: MenuRoute) => void;
  isFullScreen: boolean;
};

export function SidebarPanel ({ children, menuItems, activeRoute, onRouteChange, isFullScreen }: SidebarPanelProps) {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= WIDE_SCREEN_MIN_WIDTH;
  const [isMobilePanelOpen, setMobilePanelOpen] = useState(false);
  const isPanelOpen = isWideScreen || isMobilePanelOpen;
  const panelTranslateX = useSidebarAnimation(isPanelOpen, SIDEBAR_WIDTH);

  const togglePanel = () => setMobilePanelOpen(isOpen => !isOpen);

  const handleMenuPress = (route: MenuRoute) => {
    onRouteChange(route);
    setMobilePanelOpen(false);
  };

  const showToggleButton = !isWideScreen && !isFullScreen;
  const headerTitle = menuItems.find(item => item.id === activeRoute)?.label;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.panel, { transform: [{ translateX: panelTranslateX }] }]}>
        <View style={styles.panelTitle}>
          <Text style={styles.panelTitleText}>Menu</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map(item => {
            const isActive = activeRoute === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleMenuPress(item.id)}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
              >
                <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {showToggleButton && (
        <Pressable
          onPress={togglePanel}
          style={[styles.toggleButton, isMobilePanelOpen && styles.toggleButtonOpen]}
        >
          <Text style={styles.toggleButtonText}>{isMobilePanelOpen ? '✕' : '☰'}</Text>
        </Pressable>
      )}

      <View style={[styles.contentColumn, isWideScreen && styles.contentColumnWide]}>
        {!isFullScreen && headerTitle && (
          <ScreenHeader title={headerTitle} isWideScreen={isWideScreen} />
        )}
        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
    </View>
  );
}
