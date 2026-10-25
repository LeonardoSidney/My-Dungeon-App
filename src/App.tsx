import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { buildControllers } from '@composition/controllers';
import { ControllersProvider } from '@presentation/providers/ControllersProvider';
import { WebAlertProvider } from '@presentation/providers/WebAlertProvider';
import { RootNavigator } from '@presentation/navigation/RootNavigator';
import { colors } from '@presentation/theme';
import { useAppBootstrap } from './useAppBootstrap';

function App () {
  const controllers = useMemo(() => buildControllers(), []);
  useAppBootstrap(controllers);

  return (
    <SafeAreaProvider>
      <WebAlertProvider>
        <ControllersProvider controllers={controllers}>
          <SafeAreaView style={styles.safeArea}>
            <RootNavigator />
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
