import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SCREEN_NAMES } from '@constants/screenNames';
import BottomTabs from './BottomTabs';
import DrawerContent from './DrawerContent';
import { useThemeContext } from '@theme/ThemeProvider';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const { theme } = useThemeContext();
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerPosition: 'right',
                drawerType: 'front',
                drawerStyle: {
                    width: '85%',
                },
                overlayColor: theme.colors.modalOverlay,
            }}
        >
            <Drawer.Screen
                name={SCREEN_NAMES.BOTTOM_TABS}
                component={BottomTabs}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigation;
