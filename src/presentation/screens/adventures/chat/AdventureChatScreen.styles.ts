import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: colors.text,
    },
    errorText: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 16,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    scrollToBottomButton: {
        alignSelf: 'center',
        backgroundColor: 'rgba(70, 70, 70, 0.8)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    thinkToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    thinkToggleLabel: {
        fontSize: 14,
        color: colors.textMuted,
    },
    scrollToBottomText: {
        fontSize: 20,
        color: colors.text,
    },
});

export const thinkSwitchTrackColor = {
    false: colors.surfaceRaised,
    true: colors.primary,
};
