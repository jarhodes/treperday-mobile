import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import Statistics from './components/Statistics';

const Stack = createStackNavigator();

export default function StatsNav({ navigation }) {

    const hamburgerMenu = () => (
        <View style={styles.hamburger}>
            <Icon name="menu" onPress={() => navigation.toggleDrawer()} />
        </View>
    );

    return (
        <Stack.Navigator>
            <Stack.Screen name="Statistics" component={Statistics} options={{ headerTitle: 'Statistics',
                headerLeft: hamburgerMenu }} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    hamburger: {
        margin: 10
    }
})