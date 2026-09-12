import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const screenStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
        borderRadius: 6,
        marginTop: 8,
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        backgroundColor: colors.surfaceRaised,
        borderRadius: 6,
    },
    addButtonText: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    errorText: {
        fontSize: 14,
        color: colors.dangerSoft,
        paddingVertical: 12,
        textAlign: 'center',
    },
    loadingText: {
        color: colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: colors.textSubtle,
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
});
