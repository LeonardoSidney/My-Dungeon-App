import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    proficiencyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 8,
    },
    proficiencyInfo: {
        flex: 1,
    },
    proficiencyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    proficiencyDetails: {
        fontSize: 13,
        color: '#aaa',
        marginTop: 4,
    },
    proficiencyActions: {
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
});
