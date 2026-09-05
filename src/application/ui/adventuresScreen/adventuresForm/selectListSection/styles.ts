import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 6,
    },
    emptyDropdownText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
        paddingVertical: 8,
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
        backgroundColor: '#3a3a3a',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    selectedTagText: {
        fontSize: 12,
        color: '#fff',
    },
    selectedTagRemove: {
        fontSize: 14,
        color: '#aaa',
        marginLeft: 6,
    },
});
