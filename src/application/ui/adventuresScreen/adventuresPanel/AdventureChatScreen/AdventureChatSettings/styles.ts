import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#333',
    },
    content: {
        flex: 1,
    },
    headerText: {
        fontSize: 16,
        color: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
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
        backgroundColor: '#333',
        borderRadius: 8,
        marginBottom: 8,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    dropdownList: {
        maxHeight: 200,
    },
    worldMasterItem: {
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
        marginBottom: 4,
    },
    worldMasterItemText: {
        fontSize: 16,
        color: '#fff',
    },
});
