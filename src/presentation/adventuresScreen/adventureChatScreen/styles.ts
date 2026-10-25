import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: colors.text,
    },
    errorText: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: colors.surfaceAlt,
    },
    headerText: {
        fontSize: 16,
        color: colors.text,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
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
        color: colors.text,
    },
});
