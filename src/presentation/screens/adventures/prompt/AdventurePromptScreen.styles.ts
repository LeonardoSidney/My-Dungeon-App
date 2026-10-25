import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceRaised,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.text,
    },
    tabText: {
        fontSize: 14,
        color: colors.textSubtle,
    },
    tabTextActive: {
        color: colors.text,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    promptText: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.textSoft,
        fontFamily: 'monospace',
    },
    errorText: {
        fontSize: 14,
        color: colors.dangerSoft,
        marginBottom: 12,
    },
    noteText: {
        fontSize: 12,
        color: colors.textSubtle,
        fontStyle: 'italic',
        marginBottom: 12,
    },
});
