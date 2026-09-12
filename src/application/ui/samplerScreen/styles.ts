import { StyleSheet } from 'react-native';
import { colors } from '../theme';
import { screenStyles } from '../components/screenStyles';

export const styles = StyleSheet.create({
    ...screenStyles,
    samplerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: 8,
    },
    samplerInfo: {
        flex: 1,
    },
    samplerName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    samplerDetails: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 4,
    },
});
