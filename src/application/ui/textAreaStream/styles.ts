import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 16,
        gap: 10,
        justifyContent: 'flex-end',
        paddingBottom: 50
    },
    textInput: {
        flex: 1,
        backgroundColor: colors.text,
        borderWidth: 1,
        borderColor: colors.textSecondary,
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
        color: colors.text,
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});
