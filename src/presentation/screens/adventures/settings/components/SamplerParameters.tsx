import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SamplerListItem } from '@domain/controllers';
import { colors } from '@presentation/theme';
import {
  describeSamplerValue,
  getChangedSamplerKeys,
  hasAdvancedChanges,
  isSamplerFieldVisible,
  samplerFieldGroups,
  samplerFieldSpecs,
  type SamplerFieldGroup,
  type SamplerValueKey,
  type SamplerValues,
} from '../samplerValues';
import { SamplerParameterRow } from './SamplerParameterRow';
import { sectionStyles } from './settingsSection.styles';

type SamplerParametersProps = {
  step: number;
  sampler: SamplerListItem;
  values: SamplerValues;
  savedValues: SamplerValues;
  errors?: SamplerValues;
  sharedWith: string[];
  onChange: (key: SamplerValueKey, value: string) => void;
};

const advancedTitles = samplerFieldGroups
  .filter(group => group.isAdvanced)
  .map(group => group.title)
  .join(', ');

function summarize (sampler: SamplerListItem, changedCount: number): string {
  if (changedCount === 0) {
    return `Values of ${sampler.name}`;
  }
  return `${changedCount} changed in ${sampler.name}`;
}

function describeSharing (sharedWith: string[]): string | undefined {
  if (sharedWith.length === 0) {
    return undefined;
  }
  return `Shared with ${sharedWith.join(', ')}: they get these values too.`;
}

export function SamplerParameters ({ step, sampler, values, savedValues, errors, sharedWith, onChange }: SamplerParametersProps) {
  const changedCount = getChangedSamplerKeys(values, savedValues).length;
  const [isOpen, setIsOpen] = useState(changedCount > 0);
  const [showAdvanced, setShowAdvanced] = useState(hasAdvancedChanges(values, savedValues));
  const isLocked = sampler.systemDefault;
  const toggleLabel = isOpen ? 'Hide' : 'Adjust';
  const advancedLabel = showAdvanced ? 'Hide advanced parameters' : `Show advanced parameters (${advancedTitles})`;
  const sharingNote = describeSharing(sharedWith);
  const visibleGroups = samplerFieldGroups.filter(group => showAdvanced || !group.isAdvanced);

  const renderGroup = (group: SamplerFieldGroup) => {
    const keys = group.keys.filter(key => isSamplerFieldVisible(key, values));
    return (
      <View key={group.id} style={styles.group}>
        <Text style={styles.groupTitle}>{group.title}</Text>
        {keys.map(key => (
          <SamplerParameterRow
            key={key}
            spec={samplerFieldSpecs[key]}
            value={values[key] ?? ''}
            savedValue={savedValues[key] ?? ''}
            savedLabel={describeSamplerValue(key, savedValues[key])}
            error={errors?.[key]}
            isLocked={isLocked}
            onChange={value => onChange(key, value)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[sectionStyles.stepCard, changedCount > 0 && sectionStyles.stepCardEdited]}>
      <View style={sectionStyles.stepHeader}>
        <View style={sectionStyles.stepTexts}>
          <Text style={sectionStyles.stepLabel}>{`${step} · Parameters`}</Text>
          <Text style={styles.summary}>{summarize(sampler, changedCount)}</Text>
          {sharingNote && <Text style={sectionStyles.sharedNote}>{sharingNote}</Text>}
        </View>
        <TouchableOpacity style={sectionStyles.stepButton} onPress={() => setIsOpen(open => !open)} accessibilityRole="button">
          <Text style={sectionStyles.stepButtonText}>{toggleLabel}</Text>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View style={styles.rows}>
          {isLocked && (
            <Text style={styles.hint}>
              {sampler.name} is a system sampler and its values cannot be edited. Pick or create another sampler to tune them.
            </Text>
          )}
          {!isLocked && (
            <Text style={styles.hint}>
              These are the values saved in {sampler.name}. Changing them changes the sampler itself, in every adventure.
              Leave a field empty to use the server default.
            </Text>
          )}
          {visibleGroups.map(renderGroup)}
          <TouchableOpacity style={styles.advancedButton} onPress={() => setShowAdvanced(show => !show)} accessibilityRole="button">
            <Text style={styles.advancedText}>{advancedLabel}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    fontSize: 15,
    color: colors.text,
  },
  rows: {
    marginTop: 12,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  group: {
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  advancedButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  advancedText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accentBlue,
  },
});
