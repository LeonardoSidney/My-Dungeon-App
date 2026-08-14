import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginRight: 0,
        borderRadius: 8,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        minHeight: 48,
        alignSelf: 'stretch',
    },
    dropdownButton: {
        flex: 1,
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        minHeight: 48,
        justifyContent: 'center',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#2a2a2a',
    },
    dropdownItemWithBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a',
    },
    dropdownItemFirst: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    dropdownItemLast: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    dropdownText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdownList: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        minWidth: 150,
        maxWidth: 250,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        maxHeight: 150,
        zIndex: 1000,
    },
    itemText: {
        color: '#e0e0e0',
        fontSize: 16,
    },
});
