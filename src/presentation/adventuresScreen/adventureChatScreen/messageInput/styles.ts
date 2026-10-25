import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 16,
        borderTopWidth: 1,
        borderColor: colors.surfaceAlt,
    },
    characterSelector: {
        marginRight: 0,
    },
    input: {
        flex: 1,
        backgroundColor: colors.surfaceAlt,
        color: colors.text,
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
        borderColor: colors.placeholder,
        paddingHorizontal: 8,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendButtonText: {
        fontSize: 20,
        color: colors.text,
    },
    sendButtonContainer: {
        backgroundColor: colors.success,
        borderRadius: 8,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        paddingHorizontal: 12,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopButtonContainer: {
        backgroundColor: colors.dangerStrong,
    },
    sendButtonText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: 'bold',
    },
});
