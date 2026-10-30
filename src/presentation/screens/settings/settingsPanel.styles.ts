import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

export const settingsPanelStyles = StyleSheet.create({
    helpText: {
        color: colors.textMuted,
        fontSize: 14,
        marginBottom: 12,
    },
    unsavedText: {
        color: colors.textMuted,
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
});
