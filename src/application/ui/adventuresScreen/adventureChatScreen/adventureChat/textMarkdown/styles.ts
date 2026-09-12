import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme';

export const styles = StyleSheet.create({
    text: {
        color: colors.text
    },
    bold: {
        fontWeight: 'bold'
    },
    italic: {
        fontStyle: 'italic'
    },
    link: {
        color: '#4da6ff',
        textDecorationLine: 'underline'
    },
    inlineMath: {
        fontFamily: 'monospace',
        color: '#b8d4e3',
        backgroundColor: '#1e2a36',
        paddingVertical: 1,
        paddingHorizontal: 3,
        borderRadius: 3,
        fontSize: 14
    },
    blockMath: {
        backgroundColor: '#1e2a36',
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    blockMathText: {
        fontFamily: 'monospace',
        color: '#b8d4e3',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    inlineMathContainer: {
        color: '#e0e0e0',
        fontSize: 16,
    },
    inlineMathLoading: {
        fontFamily: 'monospace',
        color: '#b8d4e3',
        backgroundColor: '#1e2a36',
        paddingVertical: 1,
        paddingHorizontal: 3,
        borderRadius: 3,
        fontSize: 14,
    },
    blockMathContainer: {
        color: '#e0e0e0',
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    blockMathLoading: {
        backgroundColor: '#1e2a36',
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    horizontalRule: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 12
    },
    code: {
        fontFamily: 'monospace',
        backgroundColor: colors.background,
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4
    },
    paragraph: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8
    },
    heading: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
        fontWeight: 'bold'
    },
    heading1: {
        fontSize: 28,
        marginBottom: 8
    },
    heading2: {
        fontSize: 24,
        marginBottom: 6
    },
    heading3: {
        fontSize: 20,
        marginBottom: 4
    },
    heading4: {
        fontSize: 18,
        marginBottom: 4
    },
    heading5: {
        fontSize: 16,
        marginBottom: 4
    },
    heading6: {
        fontSize: 14,
        marginBottom: 4
    },
    codeBlock: {
        backgroundColor: colors.background,
        borderRadius: 4,
        padding: 12,
        marginBottom: 8
    },
    codeBlockLanguage: {
        fontSize: 12,
        color: colors.textSubtle,
        marginBottom: 4,
        fontFamily: 'monospace'
    },
    codeBlockText: {
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#e0e0e0',
        lineHeight: 20
    },
    list: {
        marginBottom: 8,
        paddingLeft: 16
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 4
    },
    listMarker: {
        color: colors.text,
        width: 30
    },
    table: {
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    tableHeaderCell: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
        borderRightWidth: 1,
        borderRightColor: colors.border
    },
    tableCell: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: colors.border
    },
    tableHeaderText: {
        fontWeight: 'bold'
    }
});
