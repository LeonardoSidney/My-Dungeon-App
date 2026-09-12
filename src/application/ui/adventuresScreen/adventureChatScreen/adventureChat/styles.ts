import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 12
    },
    chatWrapper: {
        marginBottom: 8
    },
    chatItem: {
        padding: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.surfaceAlt
    },
    chatItemWithThink: {
        padding: 12,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        borderColor: colors.surfaceAlt
    },
    characterName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#60a5fa',
        marginBottom: 4
    },
    text: {
        color: colors.text
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
        color: colors.dangerStrong
    },
    editButton: {
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    editButtonText: {
        fontSize: 14
    },
    continueButton: {
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    continueButtonText: {
        fontSize: 14,
        color: colors.success
    },
    regenerateButton: {
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    regenerateButtonText: {
        fontSize: 14,
        color: '#60a5fa'
    },
    editInput: {
        backgroundColor: colors.background,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        color: colors.text,
        minHeight: 64,
        maxHeight: 240
    },
    editSaveButton: {
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    editSaveButtonDisabled: {
        opacity: 0.35
    },
    editSaveButtonText: {
        fontSize: 14
    },
    editCancelButton: {
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    editCancelButtonText: {
        fontSize: 14,
        color: colors.dangerStrong
    }
});
