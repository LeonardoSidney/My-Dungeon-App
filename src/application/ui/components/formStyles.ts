import { StyleSheet } from 'react-native';

/**
 * Form styles shared by every entity form and by the reusable select
 * components. Single source of truth for the "same design" rule: when a
 * form or a select needs a visual change, change it here and it propagates
 * everywhere.
 */
export const formStyles = StyleSheet.create({
    form: {
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    inputGroup: {
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#ccc',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 6,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 4,
    },
    dropdown: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        maxHeight: 150,
        overflow: 'hidden',
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    optionSelected: {
        backgroundColor: '#3a3a3a',
    },
    optionText: {
        fontSize: 16,
        color: '#fff',
    },
    emptyText: {
        fontSize: 14,
        color: '#888',
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
        borderTopColor: '#333',
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#444',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    saveButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#3498db',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});
