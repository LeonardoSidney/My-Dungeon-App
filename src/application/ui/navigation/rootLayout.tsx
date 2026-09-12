import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SidebarPanel, type SidebarRoute } from '@application/ui/sidebarPanel';
import { sidebarMenuItems } from '@application/ui/constants';
import { styles } from './styles';

const IOS_KEYBOARD_VERTICAL_OFFSET = 90;

export type RootLayoutProps = {
  activeRoute: SidebarRoute;
  onRouteChange: (route: SidebarRoute) => void;
  isChatVisible: boolean;
  children: React.ReactNode;
};

export function RootLayout (params: RootLayoutProps) {
  const { activeRoute, onRouteChange, isChatVisible, children } = params;
  const keyboardBehavior = Platform.OS !== 'web' ? 'padding' : 'height';
  const keyboardVerticalOffset = Platform.OS === 'ios' ? IOS_KEYBOARD_VERTICAL_OFFSET : 0;
  const showScreenHeader = !isChatVisible;

  return (
    <SidebarPanel
      menuItems={sidebarMenuItems}
      activeRoute={activeRoute}
      onRouteChange={onRouteChange}
      isFullScreen={isChatVisible}
      showScreenHeader={showScreenHeader}
    >
      <KeyboardAvoidingView
        enabled={!isChatVisible}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.keyboardAvoiding}
      >
        {children}
      </KeyboardAvoidingView>
    </SidebarPanel>
  );
}
