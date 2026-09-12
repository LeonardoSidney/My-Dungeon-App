import { StyleSheet } from 'react-native';
import { colors } from '../theme';
import { screenStyles } from '../components/screenStyles';

export const styles = StyleSheet.create({
    ...screenStyles,
    chatOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        zIndex: 1,
    },
});
