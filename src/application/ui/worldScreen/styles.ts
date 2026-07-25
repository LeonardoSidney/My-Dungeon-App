import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    loadingText: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    worldItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 8,
    },
    worldInfo: {
        flex: 1,
    },
    worldName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    worldDetails: {
        fontSize: 13,
        color: '#aaa',
        marginTop: 4,
    },
    worldActions: {
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
});
