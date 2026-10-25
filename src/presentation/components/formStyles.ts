import { StyleSheet } from 'react-native';
import { colors } from '../theme';

/**
 * Form styles shared by every entity form and by the reusable select
 * components. Single source of truth for the "same design" rule: when a
 * form or a select needs a visual change, change it here and it propagates
 * everywhere.
 */
export const formStyles = StyleSheet.create({
    form: {
        backgroundColor: colors.surfaceInset,
        borderRadius: 8,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceAlt,
    },
    inputGroup: {
        marginBottom: 12,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: colors.textSecondary,
    },
    inputError: {
        borderColor: colors.danger,
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
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceAlt,
    },
    optionSelected: {
        backgroundColor: colors.surfaceRaised,
    },
    optionText: {
        fontSize: 16,
        color: colors.text,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSubtle,
        padding: 12,
        textAlign: 'center',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceAlt,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.border,
    },
    cancelButtonText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
    },
    saveButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    saveButtonText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
    },
});
