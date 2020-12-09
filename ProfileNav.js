import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Icon } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import Profile from './components/Profile';

const Stack = createStackNavigator();

export default function ProfileNav({ navigation }) {

    const hamburgerMenu = () => (
        <View style={styles.hamburger}>
            <Icon name="menu" onPress={() => navigation.toggleDrawer()} />
        </View>
    );

    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={Profile} options={{ headerTitle: 'Profile',
                headerLeft: hamburgerMenu }} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    hamburger: {
        margin: 10
    }
})