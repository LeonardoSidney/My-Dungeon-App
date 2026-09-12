import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import type { NavigationHelpers, StackNavigationState } from '@react-navigation/native';
import { colors } from '@application/ui/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ControllersProvider } from '@application/ui/providers/controllersProvider';
import { buildControllers } from '@composition/controllers';
import {
  SettingsScreen,
  WorldScreen,
  WorldMasterScreen,
  AssistantScreen,
  SamplerScreen,
  CharacterScreen,
  ProficiencyScreen,
  AbilitiesScreen,
  StatusesScreen,
  ItemScreen,
  LocationScreen,
  SystemPromptsScreen,
  AdventuresScreen,
  HomeScreen
} from '@application/ui';
import type { SidebarRoute } from '@application/ui/sidebarPanel';
import { RootLayout, type RootParamList } from '@application/ui/navigation';
import { runSeed } from './migration';

const { Navigator, Screen } = createNativeStackNavigator<RootParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border
  }
};

type RootNavigatorLayoutProps = {
  state: StackNavigationState<RootParamList>;
  navigation: NavigationHelpers<RootParamList>;
  children: React.ReactNode;
};

function App () {
  const [prompt, setPrompt] = useState<string>('Seélokomeu');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const controllers = useMemo(() => buildControllers(), []);

  useEffect(() => {
    runSeed()
      .then((textPrompt) => {
        if (textPrompt) {
          setPrompt(textPrompt);
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to seed data';
        Alert.alert('Erro', message);
      });
  }, []);

  const renderHome = useCallback(() => (
    <HomeScreen
      prompt={prompt}
      setPrompt={setPrompt}
    />
  ), [prompt, setPrompt]);

  const renderAdventures = useCallback(() => (
    <AdventuresScreen onChatVisibleChange={setIsChatVisible} />
  ), [setIsChatVisible]);

  const renderLayout = useCallback((props: RootNavigatorLayoutProps) => {
    const { state, navigation, children } = props;
    const activeRoute = state.routes[state.index].name;
    const isChatActive = isChatVisible && activeRoute === 'adventures';

    const handleRouteChange = (route: SidebarRoute) => {
      navigation.navigate(route, undefined, { pop: true });
    };

    return (
      <RootLayout
        activeRoute={activeRoute}
        onRouteChange={handleRouteChange}
        isChatVisible={isChatActive}
      >
        {children}
      </RootLayout>
    );
  }, [isChatVisible]);

  return (
    <SafeAreaProvider>
      <ControllersProvider controllers={controllers}>
        <SafeAreaView style={styles.safeArea}>
          <NavigationContainer theme={navigationTheme} documentTitle={{ enabled: false }}>
            <Navigator
              initialRouteName="home"
              screenOptions={{ headerShown: false }}
              layout={renderLayout}
            >
              <Screen name="home" children={renderHome} />
              <Screen name="adventures" children={renderAdventures} />
              <Screen name="characters" component={CharacterScreen} />
              <Screen name="abilities" component={AbilitiesScreen} />
              <Screen name="statuses" component={StatusesScreen} />
              <Screen name="items" component={ItemScreen} />
              <Screen name="locations" component={LocationScreen} />
              <Screen name="systemPrompts" component={SystemPromptsScreen} />
              <Screen name="proficiencies" component={ProficiencyScreen} />
              <Screen name="assistants" component={AssistantScreen} />
              <Screen name="samplers" component={SamplerScreen} />
              <Screen name="worldMasters" component={WorldMasterScreen} />
              <Screen name="worlds" component={WorldScreen} />
              <Screen name="settings" component={SettingsScreen} />
            </Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </ControllersProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  }
});

export default App;
