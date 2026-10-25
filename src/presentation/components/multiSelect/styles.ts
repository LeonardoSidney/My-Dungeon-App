import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { formStyles } from '../formStyles';

export const styles = StyleSheet.create({
    ...formStyles,
    container: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
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
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    tagText: {
        fontSize: 13,
        color: colors.text,
        fontWeight: '500',
    },
    tagRemove: {
        fontSize: 16,
        color: colors.text,
        fontWeight: 'bold',
        lineHeight: 16,
    },
});
