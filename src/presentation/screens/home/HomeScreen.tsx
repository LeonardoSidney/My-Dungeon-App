import { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeAdventureView, HomeSummaryView } from '@domain/controllers';
import { CollapsibleSection, screenStyles } from '@presentation/components';
import type { MenuRoute } from '@presentation/navigation/routes';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { colors } from '@presentation/theme';
import { useAdventureCharacters, useAdventureWorldMaster } from '../adventures/adventureQueries';
import { ContinueCard } from './components/ContinueCard';
import { Highlights } from './components/Highlights';
import { HomeSection } from './components/HomeSection';
import { RecentAdventures } from './components/RecentAdventures';
import { ServerStatusCard } from './components/ServerStatusCard';
import { SetupChecklist } from './components/SetupChecklist';
import { StorySummary } from './components/StorySummary';
import { WorldSummary } from './components/WorldSummary';
import { RECENT_ADVENTURES_LIMIT } from './constants';
import { useHomeSummary } from './hooks/useHomeSummary';
import { useServerStatus } from './hooks/useServerStatus';
import { buildSetupSteps } from './homeOverview';

type ContinueSectionProps = {
  adventure: HomeAdventureView;
  onContinue: (adventureId: string) => void;
  onOpenSettings: (adventureId: string) => void;
};

type HomeContentProps = {
  summary: HomeSummaryView;
  onNavigate: (route: MenuRoute) => void;
  onOpenChat: (adventureId: string) => void;
  onOpenSettings: (adventureId: string) => void;
};

function ContinueDetails ({ adventure, onContinue, onOpenSettings }: ContinueSectionProps) {
  const { getAdventureCharacters, getAdventureWorldMaster } = useControllers();
  const cast = useAdventureCharacters(adventure.id, getAdventureCharacters);
  const narrator = useAdventureWorldMaster(adventure.id, getAdventureWorldMaster);
  const castNames = (cast.data ?? []).map(character => character.name);

  return (
    <ContinueCard
      adventure={adventure}
      narratorName={narrator.data?.name}
      castNames={castNames}
      onContinue={() => onContinue(adventure.id)}
      onOpenSettings={() => onOpenSettings(adventure.id)}
    />
  );
}

function ContinueSection (props: ContinueSectionProps) {
  return (
    <HomeSection>
      <CollapsibleSection title="Continue" summary={props.adventure.name}>
        <ContinueDetails {...props} />
      </CollapsibleSection>
    </HomeSection>
  );
}

function describeRecent (recent: HomeAdventureView[]): string {
  if (recent.length === 0) {
    return 'No other adventures yet';
  }
  return recent.map(adventure => adventure.name).join(' · ');
}

function HomeContent ({ summary, onNavigate, onOpenChat, onOpenSettings }: HomeContentProps) {
  const { counts, adventures, story, dailyActivity, streak, highlights } = summary;
  const [latest] = adventures;
  const recent = adventures.slice(1, RECENT_ADVENTURES_LIMIT + 1);
  const steps = useMemo(() => buildSetupSteps(counts), [counts]);
  const hasPendingSteps = steps.some(step => !step.isDone);
  const hasAdventures = adventures.length > 0;

  return (
    <>
      {hasPendingSteps && (
        <HomeSection title="Get ready to play">
          <SetupChecklist steps={steps} onNavigate={onNavigate} />
        </HomeSection>
      )}

      {latest && <ContinueSection adventure={latest} onContinue={onOpenChat} onOpenSettings={onOpenSettings} />}

      {hasAdventures && (
        <HomeSection>
          <CollapsibleSection title="Recent adventures" summary={describeRecent(recent)}>
            <RecentAdventures adventures={recent} onOpen={onOpenChat} onNewAdventure={() => onNavigate('adventures')} />
          </CollapsibleSection>
        </HomeSection>
      )}

      <HomeSection title="Your world">
        <WorldSummary counts={counts} onNavigate={onNavigate} />
      </HomeSection>

      {hasAdventures && (
        <>
          <HomeSection title="Your story so far">
            <StorySummary summary={story} dailyActivity={dailyActivity} streak={streak} />
          </HomeSection>
          <HomeSection title="Highlights">
            <Highlights highlights={highlights} />
          </HomeSection>
        </>
      )}
    </>
  );
}

export function HomeScreen () {
  const navigation = useNavigation();
  const controllers = useControllers();
  const summary = useHomeSummary(controllers.getHomeSummary);
  const servers = useServerStatus(controllers);

  const navigateTo = useCallback((route: MenuRoute) => {
    navigation.navigate(route);
  }, [navigation]);

  const openChat = useCallback((adventureId: string) => {
    navigation.navigate('adventureChat', { adventureId });
  }, [navigation]);

  const openAdventureSettings = useCallback((adventureId: string) => {
    navigation.navigate('adventureSettings', { adventureId });
  }, [navigation]);

  const renderSummary = () => {
    if (summary.error) {
      return <Text style={screenStyles.errorText}>{summary.error}</Text>;
    }
    if (!summary.data) {
      return <ActivityIndicator style={styles.loading} size="large" color={colors.text} />;
    }
    return (
      <HomeContent
        summary={summary.data}
        onNavigate={navigateTo}
        onOpenChat={openChat}
        onOpenSettings={openAdventureSettings}
      />
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {renderSummary()}
      <HomeSection title="Server">
        <ServerStatusCard servers={servers.data} error={servers.error} onOpenSettings={() => navigateTo('settings')} />
      </HomeSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loading: {
    marginTop: 40,
  },
});
