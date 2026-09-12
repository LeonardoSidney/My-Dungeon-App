import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 6,
    },
    emptyDropdownText: {
        fontSize: 13,
        color: colors.placeholder,
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
        backgroundColor: colors.surfaceRaised,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    selectedTagText: {
        fontSize: 12,
        color: colors.text,
    },
    selectedTagRemove: {
        fontSize: 14,
        color: colors.textMuted,
        marginLeft: 6,
    },
});
