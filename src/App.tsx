import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SidebarPanel, type SidebarRoute } from '@application/ui';
import { ControllersProvider } from '@adapters/ui/ControllersProvider';
import { buildControllers } from '@composition/controllers';
import {
  TextAreaStream,
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
  sidebarMenuItems
} from '@application/ui';
import { runSeed } from './migration';

function App () {
  const [prompt, setPrompt] = useState<string>('Seélokomeu');
  const [activeRoute, setActiveRoute] = useState<SidebarRoute>('home');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const controllers = useMemo(() => buildControllers(), []);

  useEffect(() => {
    runSeed().catch(console.error).then((textPrompt) => {
      if (textPrompt) {
        setPrompt(textPrompt);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ControllersProvider controllers={controllers}>
        <SafeAreaView style={styles.safeArea}>
          <SidebarPanel
            menuItems={sidebarMenuItems}
            activeRoute={activeRoute}
            onRouteChange={setActiveRoute}
            isFullScreen={isChatVisible}
          >
            <KeyboardAvoidingView
              enabled={!isChatVisible}
              behavior={Platform.OS !== 'web' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
              style={styles.scrollView}
            >
              {activeRoute === 'settings' ? (
                <SettingsScreen />
              ) : activeRoute === 'worlds' ? (
                <WorldScreen />
              ) : activeRoute === 'worldMasters' ? (
                <WorldMasterScreen />
              ) : activeRoute === 'samplers' ? (
                <SamplerScreen />
              ) : activeRoute === 'assistants' ? (
                <AssistantScreen />
              ) : activeRoute === 'characters' ? (
                <CharacterScreen />
              ) : activeRoute === 'proficiencies' ? (
                <ProficiencyScreen />
              ) : activeRoute === 'abilities' ? (
                <AbilitiesScreen />
              ) : activeRoute === 'adventures' ? (
                <AdventuresScreen onChatVisibleChange={setIsChatVisible} />
              ) : activeRoute === 'statuses' ? (
                <StatusesScreen />
              ) : activeRoute === 'items' ? (
                <ItemScreen />
              ) : activeRoute === 'locations' ? (
                <LocationScreen />
              ) : activeRoute === 'systemPrompts' ? (
                <SystemPromptsScreen />
              ) : (
                <View style={styles.app}>
                  <TextAreaStream
                    prompt={prompt}
                    setPrompt={setPrompt}
                  />
                </View>
              )}
            </KeyboardAvoidingView>
          </SidebarPanel>
        </SafeAreaView>
      </ControllersProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  app: {
    gap: 10,
    flex: 1
  },
  scrollView: {
    flex: 1
  }
});

export default App;
