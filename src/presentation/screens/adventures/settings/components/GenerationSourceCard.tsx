import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EntityOption } from '@domain/controllers';
import { SingleSelect } from '@presentation/components';
import { colors } from '@presentation/theme';
import { sectionStyles } from './settingsSection.styles';

type GenerationSourceCardProps = {
  step: number;
  label: string;
  value: string;
  origin: string;
  details?: string;
  note?: string;
  isEdited: boolean;
  isDisabled?: boolean;
  resetLabel: string;
  items: EntityOption[];
  selectedId?: string;
  emptyMessage: string;
  onSelect: (item: EntityOption) => void;
  onReset: () => void;
};

export function GenerationSourceCard ({
  step,
  label,
  value,
  origin,
  details,
  note,
  isEdited,
  isDisabled = false,
  resetLabel,
  items,
  selectedId,
  emptyMessage,
  onSelect,
  onReset,
}: GenerationSourceCardProps) {
  const [isPicking, setIsPicking] = useState(false);
  const changeLabel = isPicking ? 'Close' : 'Change';

  const select = (item: EntityOption) => {
    onSelect(item);
    setIsPicking(false);
  };

  return (
    <View style={[sectionStyles.stepCard, isEdited && sectionStyles.stepCardEdited]}>
      <View style={sectionStyles.stepHeader}>
        <View style={sectionStyles.stepTexts}>
          <Text style={sectionStyles.stepLabel}>{`${step} · ${label}`}</Text>
          <Text style={styles.value} numberOfLines={1}>{value}</Text>
          <Text style={[styles.origin, isEdited && styles.originEdited]}>{origin}</Text>
          {details && <Text style={styles.details} numberOfLines={1}>{details}</Text>}
          {note && <Text style={sectionStyles.sharedNote}>{note}</Text>}
        </View>
        <TouchableOpacity
          style={[sectionStyles.stepButton, isDisabled && sectionStyles.stepButtonDisabled]}
          disabled={isDisabled}
          onPress={() => setIsPicking(picking => !picking)}
          accessibilityRole="button"
          accessibilityLabel={`${changeLabel} ${label}`}
        >
          <Text style={sectionStyles.stepButtonText}>{changeLabel}</Text>
        </TouchableOpacity>
      </View>

      {isPicking && (
        <View style={styles.picker}>
          <SingleSelect items={items} selectedId={selectedId} onSelect={select} emptyMessage={emptyMessage} />
        </View>
      )}

      {isEdited && (
        <TouchableOpacity style={styles.resetButton} onPress={onReset} accessibilityRole="button">
          <Text style={styles.resetText}>{`↺ ${resetLabel}`}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  origin: {
    fontSize: 13,
    color: colors.textMuted,
  },
  originEdited: {
    color: colors.accentBlue,
  },
  details: {
    fontSize: 13,
    color: colors.textSubtle,
  },
  picker: {
    marginTop: 12,
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 13,
    color: colors.accentBlue,
    fontWeight: '600',
  },
});
