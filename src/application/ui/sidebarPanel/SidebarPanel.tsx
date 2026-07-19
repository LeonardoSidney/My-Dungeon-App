import { HD_THRESHOLD, SIDEBAR_WIDTH } from '@application/ui/sidebarPanel/constants';
import React, { ReactNode, useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { styles } from '@application/ui/sidebarPanel/styles';
import { useWindowWidth } from '@application/ui/sidebarPanel/useWindowWidth';
import { useSidebarVisibility } from '@application/ui/sidebarPanel/useSidebarVisibility';
import { useToggle } from '@application/ui/sidebarPanel/useToggle';
import { useMenuNavigation } from '@application/ui/sidebarPanel/useMenuNavigation';

export type SidebarRoute = 'home' | 'adventures' | 'characters' | 'assistants' | 'worldMasters' | 'worlds' | 'settings';

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
}

export function SidebarPanel ({
  children,
  menuItems,
  onRouteChange,
  activeRoute,
  containerStyle,
  panelStyle,
}: SidebarPanelProps) {
  const { width } = useWindowWidth();
  const isWideScreen = width >= HD_THRESHOLD;
  const panelTranslateX = useRef(new Animated.Value(isWideScreen ? 0 : -SIDEBAR_WIDTH)).current;

  useSidebarVisibility(isWideScreen, panelTranslateX);
  const { isVisible, toggleVisibility } = useToggle(isWideScreen, panelTranslateX);
  const handleClosePanel = () => {
    if (!isWideScreen && isVisible) {
      toggleVisibility();
    }
  };
  const { handleMenuPress } = useMenuNavigation(onRouteChange, handleClosePanel);

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

      {!isWideScreen && (
        <Pressable
          onPress={toggleVisibility}
          style={[
            styles.toggleButton,
            isVisible && styles.toggleButtonOpen,
            isVisible && { left: SIDEBAR_WIDTH + 12 },
          ]}
        >
          <Text style={styles.toggleButtonText}>
            {isVisible ? '✕' : '☰'}
          </Text>
        </Pressable>
      )}

      <View style={[styles.contentArea, isWideScreen && { marginLeft: SIDEBAR_WIDTH }]}>
        {children}
      </View>
    </View>
  );
}
