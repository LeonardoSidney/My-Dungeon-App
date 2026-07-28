import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    emptyText: {
        color: '#888',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    adventureItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 8,
    },
    adventureInfo: {
        flex: 1,
    },
    adventureName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    adventureDetails: {
        fontSize: 13,
        color: '#aaa',
        marginTop: 4,
    },
    adventureActions: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 12,
    },
    actionButton: {
        padding: 8,
        backgroundColor: '#3a3a3a',
        borderRadius: 6,
    },
    actionButtonText: {
        fontSize: 16,
    },
});
