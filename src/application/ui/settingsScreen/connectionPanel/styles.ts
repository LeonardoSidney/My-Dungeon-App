import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { screenStyles } from '../../components/screenStyles';

export const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    addButton: screenStyles.addButton,
    addButtonText: screenStyles.addButtonText,
    expandIcon: {
        fontSize: 18,
        color: colors.text,
    },
    content: {
        marginTop: 8,
        paddingHorizontal: 8,
    },
    loadingText: {
        color: colors.textMuted,
        fontSize: 14,
        paddingHorizontal: 8,
    },
    errorText: {
        color: colors.dangerSoft,
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 12,
    },
    emptyText: {
        color: colors.textSubtle,
        fontSize: 14,
        fontStyle: 'italic',
        paddingHorizontal: 8,
    },
    connectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
        borderRadius: 6,
        marginBottom: 6,
    },
    connectionInfo: {
        flex: 1,
    },
    connectionName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    connectionDetails: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 2,
    },
    connectionActions: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 12,
    },
    actionButton: {
        padding: 8,
        backgroundColor: colors.surfaceRaised,
        borderRadius: 4,
    },
});
