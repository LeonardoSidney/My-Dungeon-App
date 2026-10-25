import { StyleSheet } from 'react-native';
import { colors } from '@presentation/theme';
import { HEADER_HEIGHT } from './ScreenHeader';

export const SIDEBAR_WIDTH = 240;

const TOGGLE_BUTTON_SIZE = 44;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        position: 'relative',
    },
    panel: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: colors.sidebar,
        borderRightWidth: 1,
        borderRightColor: colors.sidebarAccent,
        zIndex: 999,
    },
    panelTitle: {
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.sidebarAccent,
    },
    panelTitleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.sidebarHighlight,
    },
    menu: {
        paddingVertical: 8,
    },
    menuItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    menuItemActive: {
        backgroundColor: colors.sidebarAccent,
        borderLeftWidth: 3,
        borderLeftColor: colors.sidebarHighlight,
    },
    menuItemText: {
        fontSize: 16,
        color: colors.sidebarText,
        fontWeight: '500',
    },
    menuItemTextActive: {
        color: colors.text,
        fontWeight: '600',
    },
    toggleButton: {
        position: 'absolute',
        top: (HEADER_HEIGHT - TOGGLE_BUTTON_SIZE) / 2,
        left: 12,
        width: TOGGLE_BUTTON_SIZE,
        height: TOGGLE_BUTTON_SIZE,
        borderRadius: 8,
        backgroundColor: colors.sidebar,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    toggleButtonOpen: {
        backgroundColor: colors.sidebarRaised,
        left: SIDEBAR_WIDTH + 12,
    },
    toggleButtonText: {
        color: colors.text,
        fontSize: 22,
        fontWeight: 'bold',
    },
    contentColumn: {
        flex: 1,
    },
    contentColumnWide: {
        marginLeft: SIDEBAR_WIDTH,
    },
    contentArea: {
        flex: 1,
    },
});
