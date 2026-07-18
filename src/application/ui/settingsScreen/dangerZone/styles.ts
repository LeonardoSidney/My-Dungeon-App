import { StyleSheet } from 'react-native';

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
        backgroundColor: '#8b0000',
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    expandIcon: {
        fontSize: 18,
        color: '#fff',
    },
    content: {
        marginTop: 8,
        paddingHorizontal: 8,
    },
    warningText: {
        color: '#ff6b6b',
        fontSize: 14,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    eraseButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#dc3545',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eraseButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    eraseButtonDisabled: {
        opacity: 0.6,
    },
});
