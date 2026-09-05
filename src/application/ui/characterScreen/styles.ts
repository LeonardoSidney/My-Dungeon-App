import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    characterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 8,
    },
    characterInfo: {
        flex: 1,
    },
    characterName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    characterDetails: {
        fontSize: 13,
        color: '#aaa',
        marginTop: 4,
    },
    characterActions: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 12,
    },
    actionButton: {
        padding: 8,
        backgroundColor: '#3a3a3a',
        borderRadius: 6,
    },
    actionButtonText: {
        fontSize: 16,
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#2a2a2a',
        borderRadius: 6,
        marginTop: 8,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
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
        color: '#fff',
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
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#fff',
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
        backgroundColor: '#e74c3c',
    },
    removeAttributeButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 24,
    },
});
