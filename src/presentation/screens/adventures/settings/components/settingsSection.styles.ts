import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

export const sectionStyles = StyleSheet.create({
    helpText: {
        color: colors.textMuted,
        fontSize: 14,
        marginBottom: 12,
    },
    stepCard: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: colors.border,
        padding: 12,
        marginBottom: 12,
    },
    stepCardEdited: {
        borderLeftColor: colors.primary,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    stepTexts: {
        flex: 1,
        gap: 2,
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: colors.textSubtle,
    },
    stepButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: colors.surfaceRaised,
    },
    stepButtonDisabled: {
        opacity: 0.4,
    },
    sharedNote: {
        marginTop: 4,
        fontSize: 13,
        color: colors.dangerSoft,
    },
    stepButtonText: {
        fontSize: 14,
        color: colors.text,
    },
});
