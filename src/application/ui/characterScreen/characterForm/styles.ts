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
        maxHeight: 300,
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
    assistantDropdown: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        maxHeight: 150,
    },
    assistantOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    assistantOptionSelected: {
        backgroundColor: '#3a3a3a',
    },
    assistantOptionText: {
        fontSize: 16,
        color: '#fff',
    },
    promptInput: {
        minHeight: 100,
        textAlignVertical: 'top',
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
    selectListContainer: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
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
    selectedTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3498db',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 14,
        color: '#fff',
        marginRight: 6,
    },
    tagClose: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    attributesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addAttributeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#2ecc71',
    },
    addAttributeButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    attributeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        flexWrap: 'nowrap',
    },
    attributeInput: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#fff',
    },
    attributeNameInput: {
        flex: 1,
        minWidth: 0,
    },
    attributeValueInput: {
        flex: 0.5,
        minWidth: 0,
    },
    removeAttributeButton: {
        minWidth: 36,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#e74c3c',
    },
    removeAttributeButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 24,
    },
});
