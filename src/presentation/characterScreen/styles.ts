import { StyleSheet } from 'react-native';
import { colors } from '../theme';
import { screenStyles } from '../components/screenStyles';

export const styles = StyleSheet.create({
    ...screenStyles,
    attributesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addAttributeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#2ecc71',
    },
    addAttributeButtonText: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '600',
    },
    attributeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        flexWrap: 'nowrap',
    },
    attributeInput: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: colors.text,
    },
    attributeNameInput: {
        flex: 1,
        minWidth: 0,
    },
    attributeValueInput: {
        flex: 0.5,
        minWidth: 0,
    },
    removeAttributeButton: {
        minWidth: 36,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: colors.danger,
    },
    removeAttributeButtonText: {
        fontSize: 24,
        color: colors.text,
        fontWeight: 'bold',
        lineHeight: 24,
    },
});
