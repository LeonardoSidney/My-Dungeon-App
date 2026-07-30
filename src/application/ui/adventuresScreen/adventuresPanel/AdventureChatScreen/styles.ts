import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#333',
    },
    headerText: {
        fontSize: 16,
        color: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#333',
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
        height: 48,
        borderWidth: 0,
    },
    sendButtonContainer: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        paddingHorizontal: 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    characterSelector: {
        marginRight: 0,
    },
});
