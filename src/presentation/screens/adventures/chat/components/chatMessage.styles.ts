import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

/** Inline editor shared by a message and its reasoning. */
export const { editInputStyle } = StyleSheet.create({
    editInputStyle: {
        backgroundColor: colors.background,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        color: colors.text,
        minHeight: 64,
        maxHeight: 240,
    },
});
