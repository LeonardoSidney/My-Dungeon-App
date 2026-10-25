import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootParamList } from '@presentation/navigation/routes';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { colors } from '@presentation/theme';
import { DetailHeader } from '../DetailHeader';
import { useAdventureSummary, useAdventureWorldMaster } from '../adventureQueries';
import { WorldMasterPicker } from './WorldMasterPicker';

type AdventureSettingsScreenProps = NativeStackScreenProps<RootParamList, 'adventureSettings'>;

export function AdventureSettingsScreen ({ route, navigation }: AdventureSettingsScreenProps) {
  const { adventureId } = route.params;
  const { getAdventureSummary, getAdventureWorldMaster } = useControllers();
  const summary = useAdventureSummary(adventureId, getAdventureSummary);
  const worldMaster = useAdventureWorldMaster(adventureId, getAdventureWorldMaster);
  const adventureName = summary.data?.name ?? '';

  return (
    <View style={styles.container}>
      <DetailHeader title={`${adventureName} Settings`} onBack={navigation.goBack} />
      <ScrollView nestedScrollEnabled style={styles.content}>
        {worldMaster.isLoaded && (
          <WorldMasterPicker adventureId={adventureId} worldMaster={worldMaster.data} onChange={worldMaster.reload} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
