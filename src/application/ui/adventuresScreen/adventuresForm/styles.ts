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
    emptyDropdownText: {
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
    selectedTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    selectedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    selectedTagText: {
        fontSize: 14,
        color: colors.text,
        marginRight: 8,
    },
    selectedTagRemove: {
        fontSize: 16,
        color: colors.text,
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
});
