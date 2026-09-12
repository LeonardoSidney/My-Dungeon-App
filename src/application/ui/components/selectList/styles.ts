import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
    selectListContainer: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        overflow: 'hidden',
    },
    selectListScrollable: {
        maxHeight: 170,
    },
    selectOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceAlt,
    },
    selectOptionSelected: {
        backgroundColor: colors.surfaceRaised,
    },
    selectOptionText: {
        fontSize: 16,
        color: colors.text,
    },
    selectOptionTextSelected: {
        color: colors.primary,
    },
    selectCheckbox: {
        marginRight: 8,
    },
});
