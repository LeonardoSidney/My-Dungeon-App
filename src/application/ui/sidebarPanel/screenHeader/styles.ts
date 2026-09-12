import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const HEADER_HEIGHT = 56;

export const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerMobile: {
        paddingLeft: 68,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
});
