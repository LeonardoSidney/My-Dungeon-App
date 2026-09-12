import React, { ReactNode, useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { styles } from './styles';
import { ScreenHeader } from './screenHeader';
import { useSidebarPanel } from './useSidebarPanel';
import { useWindowWidth } from './useWindowWidth';
import { HD_THRESHOLD, SIDEBAR_WIDTH } from './constants';

export type SidebarRoute = 'home' | 'adventures' | 'characters' | 'abilities' | 'statuses' | 'items' | 'locations' | 'systemPrompts' | 'proficiencies' | 'assistants' | 'samplers' | 'worldMasters' | 'worlds' | 'settings';

export interface SidebarMenuItem {
  id: SidebarRoute;
  label: string;
}

export interface SidebarPanelProps {
  children: ReactNode;
  menuItems: SidebarMenuItem[];
  onRouteChange?: (route: SidebarRoute) => void;
  activeRoute?: SidebarRoute;
  containerStyle?: ViewStyle;
  panelStyle?: ViewStyle;
  isFullScreen?: boolean;
  showScreenHeader?: boolean;
}

export function SidebarPanel ({
  children,
  menuItems,
  onRouteChange,
  activeRoute,
  containerStyle,
  panelStyle,
  isFullScreen,
  showScreenHeader,
}: SidebarPanelProps) {
  const windowWidth = useWindowWidth();
  const isWideScreen = windowWidth >= HD_THRESHOLD;
  const panelTranslateX = useRef(new Animated.Value(isWideScreen ? 0 : -SIDEBAR_WIDTH)).current;

  const { isPanelOpen, togglePanel } = useSidebarPanel(isWideScreen, panelTranslateX);
  const handleClosePanel = () => {
    if (!isWideScreen && isPanelOpen) {
      togglePanel();
    }
  };
  const handleMenuPress = (id: SidebarRoute) => {
    onRouteChange?.(id);
    handleClosePanel();
  };
  const showToggleButton = !isWideScreen && !isFullScreen;
  const headerTitle = menuItems.find((item) => item.id === activeRoute)?.label;

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.panel,
          panelStyle,
          { transform: [{ translateX: panelTranslateX }] },
        ]}
      >
        <Text style={styles.panelTitle}>Menu</Text>
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
              style={[
                styles.menuItem,
                activeRoute === item.id && styles.menuItemActive,
              ]}
            >
              <Text
                style={[
                  styles.menuItemText,
                  activeRoute === item.id && styles.menuItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {showToggleButton && (
        <Pressable
          onPress={togglePanel}
          style={[
            styles.toggleButton,
            isPanelOpen && styles.toggleButtonOpen,
            isPanelOpen && { left: SIDEBAR_WIDTH + 12 },
          ]}
        >
          <Text style={styles.toggleButtonText}>
            {isPanelOpen ? '✕' : '☰'}
          </Text>
        </Pressable>
      )}

      <View
        style={[
          styles.contentColumn,
          isWideScreen && { marginLeft: SIDEBAR_WIDTH },
        ]}
      >
        {showScreenHeader && headerTitle && (
          <ScreenHeader
            title={headerTitle}
            isWideScreen={isWideScreen}
          />
        )}
        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
    </View>
  );
}
