import { ReactNode } from 'react';
import { DarkTheme, NavigationContainer, type NavigationHelpers, type StackNavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@presentation/theme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AdventuresScreen } from '../screens/adventures/AdventuresScreen';
import { AdventureChatScreen } from '../screens/adventures/chat/AdventureChatScreen';
import { AdventureSettingsScreen } from '../screens/adventures/settings/AdventureSettingsScreen';
import { AdventurePromptScreen } from '../screens/adventures/prompt/AdventurePromptScreen';
import { CharacterScreen } from '../screens/characters/CharacterScreen';
import {
  AbilitiesScreen,
  ItemsScreen,
  LocationsScreen,
  ProficienciesScreen,
  StatusesScreen,
  WorldsScreen,
} from '../screens/activationPrompts/activationPromptScreens';
import { SystemPromptsScreen } from '../screens/systemPrompts/SystemPromptsScreen';
import { AssistantScreen } from '../screens/assistants/AssistantScreen';
import { SamplerScreen } from '../screens/samplers/SamplerScreen';
import { WorldMasterScreen } from '../screens/worldMasters/WorldMasterScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { RootLayout } from './RootLayout';
import type { MenuRoute, RootParamList } from './routes';

const Stack = createNativeStackNavigator<RootParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

type StackLayoutProps = {
  state: StackNavigationState<RootParamList>;
  navigation: NavigationHelpers<RootParamList>;
  children: ReactNode;
};

function StackLayout ({ state, navigation, children }: StackLayoutProps) {
  const handleMenuRouteChange = (route: MenuRoute) => {
    navigation.navigate(route, undefined, { pop: true });
  };

  return (
    <RootLayout activeRoute={state.routes[state.index].name} onMenuRouteChange={handleMenuRouteChange}>
      {children}
    </RootLayout>
  );
}

export function RootNavigator () {
  return (
    <NavigationContainer theme={navigationTheme} documentTitle={{ enabled: false }}>
      <Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }} layout={StackLayout}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="adventures" component={AdventuresScreen} />
        <Stack.Screen name="adventureChat" component={AdventureChatScreen} />
        <Stack.Screen name="adventureSettings" component={AdventureSettingsScreen} />
        <Stack.Screen name="adventurePrompt" component={AdventurePromptScreen} />
        <Stack.Screen name="characters" component={CharacterScreen} />
        <Stack.Screen name="abilities" component={AbilitiesScreen} />
        <Stack.Screen name="statuses" component={StatusesScreen} />
        <Stack.Screen name="items" component={ItemsScreen} />
        <Stack.Screen name="locations" component={LocationsScreen} />
        <Stack.Screen name="systemPrompts" component={SystemPromptsScreen} />
        <Stack.Screen name="proficiencies" component={ProficienciesScreen} />
        <Stack.Screen name="assistants" component={AssistantScreen} />
        <Stack.Screen name="samplers" component={SamplerScreen} />
        <Stack.Screen name="worldMasters" component={WorldMasterScreen} />
        <Stack.Screen name="worlds" component={WorldsScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
