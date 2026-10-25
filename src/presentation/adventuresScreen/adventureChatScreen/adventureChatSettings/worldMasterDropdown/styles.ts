import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme';

export const styles = StyleSheet.create({
    worldMasterSection: {
        padding: 16,
    },
    dropdownButton: {
        padding: 12,
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
        marginBottom: 8,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: colors.text,
    },
    dropdownList: {
        maxHeight: 200,
    },
    worldMasterItem: {
        padding: 8,
        marginBottom: 4,
    },
    worldMasterItemText: {
        fontSize: 16,
        color: colors.text,
    },
    getWorldMasterButton: {
        padding: 12,
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
        marginBottom: 4,
    },
    getWorldMasterButtonText: {
        fontSize: 16,
        color: colors.text,
    },
    addWorldMasterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.primary,
        marginBottom: 4,
    },
    addWorldMasterButtonText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
        textAlign: 'center',
    },
});
