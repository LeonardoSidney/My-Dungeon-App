import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme';

export const styles = StyleSheet.create({
    thinkContainer: {
        padding: 12,
        backgroundColor: 'transparent',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomWidth: 0
    },
    thinkText: {
        fontSize: 13,
        fontStyle: 'italic',
        color: colors.textSubtle
    },
    thinkEditInput: {
        backgroundColor: colors.background,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        color: colors.text,
        fontSize: 13,
        fontStyle: 'italic',
        minHeight: 64,
        maxHeight: 240
    }
});
