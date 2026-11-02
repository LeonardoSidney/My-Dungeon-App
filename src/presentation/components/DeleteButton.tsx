import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { colors } from '@presentation/theme';
import { confirmDelete } from '@presentation/utils/confirmDelete';
import { IconButton } from './IconButton';

type DeleteButtonProps = {
  itemName: string;
  onConfirm: () => void;
  message?: string;
  label?: string;
  disabled?: boolean;
};

export function DeleteButton ({ itemName, onConfirm, message, label, disabled }: DeleteButtonProps) {
  const { alert } = useControllers();
  const requestDelete = () => confirmDelete(alert, { itemName, message, onConfirm });

  if (!label) {
    return <IconButton icon={Trash2} accessibilityLabel="Delete" onPress={requestDelete} />;
  }

  return (
    <TouchableOpacity
      style={[styles.labelButton, disabled && styles.labelButtonDisabled]}
      accessibilityRole="button"
      onPress={requestDelete}
      disabled={disabled}
    >
      <Text style={styles.labelButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  labelButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.dangerButton,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  labelButtonDisabled: {
    opacity: 0.6,
  },
});
