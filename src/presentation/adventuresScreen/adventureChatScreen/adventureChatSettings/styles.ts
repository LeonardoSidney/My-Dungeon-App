import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: colors.surfaceAlt,
    },
    content: {
        flex: 1,
    },
    headerText: {
        fontSize: 16,
        color: colors.text,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        marginRight: 16,
    },
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
        padding: 12,
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
        marginBottom: 4,
    },
    worldMasterItemText: {
        fontSize: 16,
        color: colors.text,
    },
});
