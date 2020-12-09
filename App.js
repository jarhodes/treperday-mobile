import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import ApiContext from './ApiContext.js';
import ApiState from './ApiState.js';
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from 'react-native';
import StackNav from './StackNav.js';
import Profile from './components/Profile.js';
import { Avatar, Icon, Text } from 'react-native-elements';
import ProfileNav from './ProfileNav.js';
import StatsNav from './StatsNav.js';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
                setUser({ username: userJson.username, password: userJson.password, firstName: responseJson.firstName, 
                    lastName: responseJson.lastName, avatarIcon: responseJson.avatarIcon, avatarColour: responseJson.avatarColour });
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
                        <Drawer.Navigator initialRouteName="Activities" drawerContentOptions={{ itemStyle: { marginVertical: 5 } }} drawerContent={(props) => (
                            <SafeAreaView style={{flex: 1}}>
                                <Image source={require("./assets/text12.png")} style={styles.sideMenuProfileIcon} />
                                <DrawerContentScrollView {...props}>
                                    <DrawerItemList {...props} />
                                </DrawerContentScrollView>
                            </SafeAreaView>)}>
                            <Drawer.Screen name="Profile" component={ProfileNav} />
                            <Drawer.Screen name="Activities" component={StackNav} />
                            <Drawer.Screen name="Statistics" component={StatsNav} />
                        </Drawer.Navigator>
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
    },
    sideMenuProfileIcon: {
        resizeMode: "center",
        width: 110,
        height: 141,
        alignSelf: 'center',
      },
})