import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 12
    },
    chatWrapper: {
        marginBottom: 8
    },
    chatItem: {
        padding: 12,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333'
    },
    chatItemWithThink: {
        padding: 12,
        backgroundColor: '#2a2a2a',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        borderColor: '#333'
    },
    characterName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#60a5fa',
        marginBottom: 4
    },
    text: {
        fontSize: 16,
        color: '#e0e0e0',
        lineHeight: 24
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 4,
        marginRight: 4,
        gap: 4
    },
    deleteButton: {
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    deleteButtonText: {
        fontSize: 14,
        color: '#ef4444'
    },
    regenerateButton: {
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    regenerateButtonText: {
        fontSize: 14,
        color: '#60a5fa'
    }
});
