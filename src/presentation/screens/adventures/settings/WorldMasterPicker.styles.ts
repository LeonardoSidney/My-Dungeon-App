import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';

export const styles = StyleSheet.create({
    section: {
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
    currentItem: {
        padding: 8,
        marginBottom: 4,
    },
    itemText: {
        fontSize: 16,
        color: colors.text,
    },
    candidateButton: {
        padding: 12,
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
        marginBottom: 4,
    },
    addButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.primary,
        marginBottom: 4,
    },
    addButtonText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
        textAlign: 'center',
    },
});
