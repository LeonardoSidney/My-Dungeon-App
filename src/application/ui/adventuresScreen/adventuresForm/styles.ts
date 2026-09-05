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
        fontSize: 18,
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
        color: '#ccc',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 4,
    },
    promptInput: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#ccc',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    observationInput: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#ccc',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    dropdown: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        maxHeight: 150,
        overflow: 'hidden',
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
    emptyDropdownText: {
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
    selectListContainer: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        overflow: 'hidden',
    },
    selectListScrollable: {
        maxHeight: 170,
    },
    selectOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    selectOptionSelected: {
        backgroundColor: '#3a3a3a',
    },
    selectOptionText: {
        fontSize: 16,
        color: '#fff',
    },
    selectOptionTextSelected: {
        color: '#3498db',
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
        backgroundColor: '#3498db',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    selectedTagText: {
        fontSize: 14,
        color: '#fff',
        marginRight: 8,
    },
    selectedTagRemove: {
        fontSize: 16,
        color: '#fff',
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
});
