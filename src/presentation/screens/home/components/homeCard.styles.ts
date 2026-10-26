import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

export const homeCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: colors.textSubtle,
    },
    muted: {
        fontSize: 13,
        color: colors.textMuted,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceAlt,
    },
    rowTexts: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 15,
        color: colors.text,
    },
});
