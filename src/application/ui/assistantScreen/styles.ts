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
