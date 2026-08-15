import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#333',
    },
    characterSelector: {
        marginRight: 0,
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 0,
        borderLeftWidth: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        padding: 12,
        marginRight: 0,
        minHeight: 48,
        maxHeight: 120,
        borderWidth: 0,
    },
    resendButtonContainer: {
        backgroundColor: '#555',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#666',
        paddingHorizontal: 8,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendButtonText: {
        fontSize: 20,
        color: '#fff',
    },
    sendButtonContainer: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        paddingHorizontal: 12,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopButtonContainer: {
        backgroundColor: '#ef4444',
    },
    sendButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
