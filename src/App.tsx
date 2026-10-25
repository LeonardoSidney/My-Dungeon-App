import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import type { NavigationHelpers, StackNavigationState } from '@react-navigation/native';
import { colors } from '@presentation/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ControllersProvider } from '@presentation/providers/controllersProvider';
import { WebAlertProvider } from '@presentation/providers/webAlertProvider';
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
} from '@presentation';
import type { SidebarRoute } from '@presentation/sidebarPanel';
import { RootLayout, type RootParamList } from '@presentation/navigation';
import { runSeed } from './migration';
import { HOME_DRAFT_ID } from '@domain/constants/draft';

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
  const { alert, recoverInterruptedReplies, saveDraft } = controllers;

  useEffect(() => {
    const seed = async () => {
      const response = await runSeed();
      if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to seed data' });
        return;
      }

      if (!response.prompt) {
        return;
      }

      const saved = await saveDraft.handle({ draftId: HOME_DRAFT_ID, content: response.prompt, onlyIfMissing: true });
      if (!saved.success) {
        alert.handle({ title: 'Erro', message: saved.error ?? 'Failed to save the initial draft' });
      }
    };

    const recoverReplies = async () => {
      const response = await recoverInterruptedReplies.handle();
      if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to recover interrupted replies' });
      }
    };

    seed().then(recoverReplies);
  }, [alert, recoverInterruptedReplies, saveDraft]);

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
      <WebAlertProvider>
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
      </WebAlertProvider>
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
