import { StyleSheet, Switch, Text, View } from 'react-native';
import { CollapsibleSection, switchTrackColor } from '@presentation/components';
import { colors } from '@presentation/theme';
import { settingsPanelStyles } from './settingsPanel.styles';

const SWITCH_LABEL = 'Write a scene summary';

type SceneContextPanelProps = {
  sceneContextEnabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function SceneContextPanel ({ sceneContextEnabled, onChange }: SceneContextPanelProps) {
  const summary = sceneContextEnabled ? 'On' : 'Off';

  return (
    <CollapsibleSection title="Scene Context" summary={summary}>
      <View style={styles.row}>
        <Text style={styles.label}>{SWITCH_LABEL}</Text>
        <Switch
          value={sceneContextEnabled}
          onValueChange={onChange}
          trackColor={switchTrackColor}
          accessibilityLabel={SWITCH_LABEL}
        />
      </View>
      <Text style={settingsPanelStyles.helpText}>
        Before each AI reply, the model summarizes the scene to guide it. Turn it off for faster replies with one model call less.
      </Text>
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    gap: 12,
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
});
