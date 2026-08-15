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
    scrollToBottomButton: {
        alignSelf: 'center',
        backgroundColor: 'rgba(70, 70, 70, 0.8)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    scrollToBottomText: {
        fontSize: 20,
        color: '#fff',
    },
});
