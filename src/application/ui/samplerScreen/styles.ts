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
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#3498db',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    addButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
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
    samplerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 8,
    },
    samplerInfo: {
        flex: 1,
    },
    samplerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    samplerDetails: {
        fontSize: 13,
        color: '#aaa',
        marginTop: 4,
    },
    samplerActions: {
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
