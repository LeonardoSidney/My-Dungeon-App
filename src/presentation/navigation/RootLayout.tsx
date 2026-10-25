import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SidebarPanel } from './sidebar/SidebarPanel';
import { isFullScreenRoute, menuItems, toMenuRoute, type MenuRoute, type RootRoute } from './routes';

const IOS_KEYBOARD_VERTICAL_OFFSET = 90;

type RootLayoutProps = {
  activeRoute: RootRoute;
  onMenuRouteChange: (route: MenuRoute) => void;
  children: ReactNode;
};

export function RootLayout ({ activeRoute, onMenuRouteChange, children }: RootLayoutProps) {
  const isFullScreen = isFullScreenRoute(activeRoute);

  return (
    <SidebarPanel
      menuItems={menuItems}
      activeRoute={toMenuRoute(activeRoute)}
      onRouteChange={onMenuRouteChange}
      isFullScreen={isFullScreen}
    >
      <KeyboardAvoidingView
        enabled={!isFullScreen}
        behavior={Platform.OS === 'web' ? 'height' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? IOS_KEYBOARD_VERTICAL_OFFSET : 0}
        style={styles.keyboardAvoiding}
      >
        {children}
      </KeyboardAvoidingView>
    </SidebarPanel>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
});
