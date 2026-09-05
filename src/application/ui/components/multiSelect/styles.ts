import { StyleSheet } from 'react-native';
import { formStyles } from '../formStyles';

export const styles = StyleSheet.create({
    ...formStyles,
    container: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        overflow: 'hidden',
    },
    scrollable: {
        maxHeight: 170,
    },
    selectedTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#3498db',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    tagText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '500',
    },
    tagRemove: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 16,
    },
});
