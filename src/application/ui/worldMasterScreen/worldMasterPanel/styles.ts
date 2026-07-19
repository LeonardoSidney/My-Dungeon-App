import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#2a2a2a',
        borderRadius: 6,
        marginTop: 8,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    loadingText: {
        color: '#aaa',
        fontSize: 14,
        paddingHorizontal: 8,
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
        fontStyle: 'italic',
        paddingHorizontal: 8,
    },
    worldMasterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#2a2a2a',
        borderRadius: 6,
        marginBottom: 6,
    },
    worldMasterInfo: {
        flex: 1,
    },
    worldMasterName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    worldMasterDetails: {
        fontSize: 13,
        color: '#aaa',
        marginTop: 2,
    },
    worldMasterActions: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 12,
    },
    actionButton: {
        padding: 8,
        backgroundColor: '#3a3a3a',
        borderRadius: 4,
    },
    actionButtonText: {
        fontSize: 16,
    },
});
