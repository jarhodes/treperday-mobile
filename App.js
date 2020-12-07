import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import TaskScreen from './components/TaskScreen.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Performance from './components/Performance.js';
import ApiContext from './ApiContext.js';
import ApiState from './ApiState.js';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import CapturePhoto from './components/CapturePhoto.js';
import ViewPhoto from './components/ViewPhoto.js';
import UserLocation from './components/UserLocation.js';
import ViewLocation from './components/ViewLocation.js';
import TaskHistory from './components/TaskHistory.js';

const Stack = createStackNavigator();

export default function App() {

    const apiVariables = React.useContext(ApiContext);
    const [user, setUser] = React.useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });
    const [userOk, setUserOk] = React.useState(false);

    const getUser = async () => {
        let currentUser;
        try {
            currentUser = await AsyncStorage.getItem("user");
        } catch (error) {
            console.log(error);
        }

        if (currentUser == null) {
            createUser();            
        }
        else {
            fetchUserDetails(JSON.parse(currentUser));
        }
    }

    const createUser = () => {
        console.log("Getting new user account");
            fetch(apiVariables.apiUrl + "/api/user/create", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key: apiVariables.apiKey
                    })
                })
                .then(response => response.text())
                .then(responseText => {
                    if (responseText.length) {
                        return JSON.parse(responseText);
                    }
                    else {
                        return Promise.reject("Empty string returned by "+apiVariables.apiUrl+"/api/user/create");
                    }
                })
                .then(async (responseJson) => {
                    try {
                        await AsyncStorage.setItem("user", JSON.stringify(responseJson));
                        fetchUserDetails(responseJson);
                    } catch (error) {
                        return Promise.reject("AsyncStorage error");
                    }
                })
                .catch(error => console.log(error));
    }

    const authorizationHeaders = (userCredentials) => {
        console.log("Running authorizationHeaders with credentials = "+JSON.stringify(userCredentials));
        const base64 = require('base-64');
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64.encode(userCredentials.username + ':' + userCredentials.password));
        return headers;
    }

    const fetchUserDetails = (userJson) => {
        console.log("Fetching user details");
        const headers = authorizationHeaders(userJson);
        fetch(apiVariables.apiUrl + "/api/user/details", {
            headers: headers
        })
            .then(response => response.text())
            .then(responseText => {
                if (responseText.length) {
                    console.log("Received: "+responseText);
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Empty string returned by "+apiVariables.apiUrl + "/api/user/details");
                }
            })
            .then(responseJson => {
                setUser({ username: userJson.username, password: userJson.password, firstName: responseJson.firstName, lastName: responseJson.lastName });
                setUserOk(true);
                console.log(JSON.stringify(responseJson));
            })
            .catch(error => {
                console.log(error);
                createUser();
            });
    }

    React.useEffect(() => {
        getUser();
    }, []);

    return (
        <View style={styles.appContainer}>
            { userOk ? (
                <ApiState user={user} authHeaders={authorizationHeaders(user)}>
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen name="TaskScreen" component={TaskScreen} options={{ title: 'Activities' }} />
                            <Stack.Screen name="TaskHistory" component={TaskHistory} options={{ title: 'Your activities' }} />
                            <Stack.Screen name="Activity" component={Performance} />
                            <Stack.Screen name="CapturePhoto" component={CapturePhoto} options={{ title: 'Take photo' }} />
                            <Stack.Screen name="ViewPhoto" component={ViewPhoto} options={{ title: 'Photo' }} />
                            <Stack.Screen name="UserLocation" component={UserLocation} options={{ title: 'Map' }} />
                            <Stack.Screen name="ViewLocation" component={ViewLocation} options={{ title: 'Map' }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ApiState>
            ) : (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#555" />
                </View>
            ) }
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})