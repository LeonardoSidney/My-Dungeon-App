import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        gap: 10,
        justifyContent: 'flex-end',
        paddingBottom: 50
    },
    textInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        lineHeight: 22,
        minHeight: 150
    }
});

export const buttonStyles = StyleSheet.create({
    stream: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});
