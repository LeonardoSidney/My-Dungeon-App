import { SIDEBAR_WIDTH } from '@application/ui/sidebarPanel/constants';
import { StyleSheet } from 'react-native';

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
        backgroundColor: '#1a1a2e',
        borderRightWidth: 1,
        borderRightColor: '#0f3460',
        zIndex: 999,
    },
    panelTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#e94560',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#0f3460',
    },
    menu: {
        paddingVertical: 8,
    },
    menuItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    menuItemActive: {
        backgroundColor: '#0f3460',
        borderLeftWidth: 3,
        borderLeftColor: '#e94560',
    },
    menuItemText: {
        fontSize: 16,
        color: '#a8a8b3',
        fontWeight: '500',
    },
    menuItemTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    toggleButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#1a1a2e',
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
        backgroundColor: '#16213e',
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    contentArea: {
        flex: 1,
        paddingTop: 70,
    },
});
