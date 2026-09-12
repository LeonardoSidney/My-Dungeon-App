import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 6,
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        marginTop: 4,
    },
    dropdown: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        maxHeight: 150,
        overflow: 'hidden',
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceAlt,
    },
    dropdownOptionSelected: {
        backgroundColor: colors.surfaceRaised,
    },
    dropdownOptionText: {
        fontSize: 16,
        color: colors.text,
    },
});
