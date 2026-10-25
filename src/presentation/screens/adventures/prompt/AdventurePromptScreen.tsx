import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootParamList } from '@presentation/navigation/routes';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { colors } from '@presentation/theme';
import { DetailHeader } from '../DetailHeader';
import { useAdventureSummary } from '../adventureQueries';
import { usePromptQuery } from './usePromptQuery';
import { styles } from './AdventurePromptScreen.styles';

type Tab = 'systemPrompt' | 'templatedPrompt';

type AdventurePromptScreenProps = NativeStackScreenProps<RootParamList, 'adventurePrompt'>;

export function AdventurePromptScreen ({ route, navigation }: AdventurePromptScreenProps) {
  const { adventureId } = route.params;
  const { getAdventureSummary, getAdventureSystemPrompt, getAdventureTemplatedPrompt } = useControllers();
  const [activeTab, setActiveTab] = useState<Tab>('systemPrompt');

  const summary = useAdventureSummary(adventureId, getAdventureSummary);

  const systemPrompt = usePromptQuery(useCallback(
    () => getAdventureSystemPrompt.handle({ adventureId }),
    [adventureId, getAdventureSystemPrompt],
  ));
  const templatedPrompt = usePromptQuery(useCallback(
    () => getAdventureTemplatedPrompt.handle({ adventureId }),
    [adventureId, getAdventureTemplatedPrompt],
  ));

  const isSystemPromptTab = activeTab === 'systemPrompt';
  const active = isSystemPromptTab ? systemPrompt : templatedPrompt;
  const requestActive = active.request;

  useEffect(() => {
    requestActive();
  }, [requestActive]);

  const renderTab = (tab: Tab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity style={[styles.tab, isActive && styles.tabActive]} onPress={() => setActiveTab(tab)}>
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderPrompt = () => {
    if (active.prompt) {
      return (
        <ScrollView nestedScrollEnabled>
          <Text style={styles.promptText}>{active.prompt}</Text>
        </ScrollView>
      );
    }
    if (!active.error && !active.isLoading) {
      return <Text style={styles.noteText}>No prompt available.</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <DetailHeader title={summary.data?.name ?? ''} onBack={navigation.goBack} />

      <View style={styles.tabs}>
        {renderTab('systemPrompt', 'System prompt')}
        {renderTab('templatedPrompt', 'Final (template + chat)')}
      </View>

      <View style={styles.content}>
        {active.error && <Text style={styles.errorText}>Error: {active.error}</Text>}
        {!isSystemPromptTab && !active.error && (
          <Text style={styles.noteText}>Includes the current chat and the model template tokens.</Text>
        )}
        {active.isLoading && <ActivityIndicator color={colors.text} />}
        {renderPrompt()}
      </View>
    </View>
  );
}
