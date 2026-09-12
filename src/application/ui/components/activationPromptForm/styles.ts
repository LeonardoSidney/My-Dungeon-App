import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    form: {
        backgroundColor: colors.surfaceInset,
        borderRadius: 8,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceAlt,
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 18,
        color: colors.textMuted,
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 6,
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
    errorText: {
        color: colors.danger,
        fontSize: 12,
        marginTop: 4,
    },
    promptInput: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: colors.textSecondary,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    observationInput: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: colors.textSecondary,
        minHeight: 80,
        textAlignVertical: 'top',
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
        backgroundColor: '#0a74ca',
    },
    saveButtonText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
    },
});
