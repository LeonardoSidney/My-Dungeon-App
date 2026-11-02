import { StyleSheet, Text } from 'react-native';
import { CollapsibleSection, DeleteButton } from '@presentation/components';
import { colors } from '@presentation/theme';

const ERASE_ALL_MESSAGE = 'All adventures and their chats will be permanently deleted. This action cannot be undone.';

type DangerZoneProps = {
  isErasing: boolean;
  onErase: () => void;
};

export function DangerZone ({ isErasing, onErase }: DangerZoneProps) {
  const eraseLabel = isErasing ? 'Erasing...' : 'Erase All Adventures';

  return (
    <CollapsibleSection title="Danger Zone" headerColor={colors.dangerDark}>
      <Text style={styles.warningText}>This action cannot be undone. All adventures will be permanently deleted.</Text>
      <DeleteButton
        itemName="all adventures"
        message={ERASE_ALL_MESSAGE}
        label={eraseLabel}
        disabled={isErasing}
        onConfirm={onErase}
      />
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  warningText: {
    color: colors.dangerSoft,
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
