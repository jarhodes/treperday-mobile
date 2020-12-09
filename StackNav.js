import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CapturePhoto from './components/CapturePhoto';
import Performance from './components/Performance';
import TaskHistory from './components/TaskHistory';
import TaskScreen from './components/TaskScreen';
import UserLocation from './components/UserLocation';
import ViewLocation from './components/ViewLocation';
import ViewPhoto from './components/ViewPhoto';
import { Icon } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

const Stack = createStackNavigator();

export default function StackNav({ navigation }) {

    const hamburgerMenu = () => (
        <View style={styles.hamburger}>
            <Icon name="menu" onPress={() => navigation.toggleDrawer()} />
        </View>
    );

    return (
            <Stack.Navigator>
                <Stack.Screen name="TaskScreen" component={TaskScreen} options={{ headerTitle: 'Activities',
            headerLeft: hamburgerMenu }} />
                <Stack.Screen name="TaskHistory" component={TaskHistory} options={{ headerTitle: 'Your activities',
            headerLeft: hamburgerMenu }} />
                <Stack.Screen name="Activity" component={Performance} />
                <Stack.Screen name="CapturePhoto" component={CapturePhoto} options={{ title: 'Take photo' }} />
                <Stack.Screen name="ViewPhoto" component={ViewPhoto} options={{ title: 'Photo' }} />
                <Stack.Screen name="UserLocation" component={UserLocation} options={{ title: 'Map' }} />
                <Stack.Screen name="ViewLocation" component={ViewLocation} options={{ title: 'Map' }} />
            </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    hamburger: {
        margin: 10
    }
})