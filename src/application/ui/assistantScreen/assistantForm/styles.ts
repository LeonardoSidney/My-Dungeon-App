import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    form: {
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#aaa',
    },
    scrollView: {
        maxHeight: 400,
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#fff',
    },
    inputError: {
        borderColor: '#e74c3c',
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
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    dropdownOptionSelected: {
        backgroundColor: '#3a3a3a',
    },
    dropdownOptionText: {
        fontSize: 16,
        color: '#fff',
    },
    observationInput: {
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
    saveButtonDisabled: {
        backgroundColor: '#2c5f8a',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    emptyDropdownText: {
        padding: 16,
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
