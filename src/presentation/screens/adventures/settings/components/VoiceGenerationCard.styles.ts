import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: colors.surfaceAlt,
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    cardEdited: {
        borderColor: colors.primary,
    },
    cardError: {
        borderColor: colors.danger,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: colors.surfaceInset,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surfaceRaised,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    headerTexts: {
        flex: 1,
        gap: 2,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    name: {
        flexShrink: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    role: {
        fontSize: 12,
        color: colors.textSubtle,
    },
    summary: {
        fontSize: 13,
        color: colors.textMuted,
    },
    edited: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
    expandIcon: {
        fontSize: 16,
        color: colors.text,
    },
    body: {
        padding: 10,
    },
    notice: {
        borderLeftWidth: 3,
        borderLeftColor: colors.accentBlue,
        backgroundColor: colors.surface,
        borderRadius: 4,
        padding: 10,
        marginBottom: 12,
        fontSize: 13,
        color: colors.textMuted,
    },
});
