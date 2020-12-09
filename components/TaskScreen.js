import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import ApiContext from '../ApiContext';
import Task from './Task';
import Moment from 'moment';

export default function TaskScreen(props) {

    const apiVariables = React.useContext(ApiContext);
    const [tasks, setTasks] = React.useState([]);
    const navigation = useNavigation();
    
    const initiateTasks = () => {
        let taskDate;
        
        if (props.route && props.route.params && props.route.params.date) {
            console.log("props route params date is " +props.route.params.date);
            taskDate = new Date(props.route.params.date);
            const dateString = Moment(taskDate).format("D.M.YYYY")
            navigation.setOptions({ title: "Activities - " + dateString });
        }
        else {
            taskDate = new Date();
            navigation.setOptions({ title: "Today's activities" });
        }

        console.log("date is "+taskDate.toISOString());
        const serverDate = taskDate.toISOString().substring(0, 10);
        console.log("serverDate is "+serverDate);

        console.log("fetching "+ apiVariables.apiUrl + "/api/task/tasksbydate?date="+serverDate);
        console.log("Auth variables are " + JSON.stringify(apiVariables.authHeaders));

        fetch(apiVariables.apiUrl + "/api/task/tasksbydate?date="+serverDate)
            .then(response => {
                if (response.ok) {
                    console.log("Fetch response is OK");
                    return response.json();
                }
                else {
                    return Promise.reject("No tasks yet assigned");
                }
            })
            .then(responseJson => setTasks(responseJson))
            .catch(error => {
                assignThree(serverDate);
                console.log(error);
            });
    }

    const assignThree = (serverDate) => {
        fetch(apiVariables.apiUrl + "/api/task/assignthree?date="+serverDate, {
            method: 'POST',
            headers: apiVariables.authHeaders
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    return Promise.reject("Assignthree failed");
                }
            })
            .then(responseJson => {
                console.log("Result of assignthree is ");
                console.log(responseJson);
                setTasks(responseJson);
            })
            .catch(error => console.log(error));
    }
    
    useFocusEffect(
        React.useCallback(() => {
            initiateTasks();
        }, [])
    );
    /*
    React.useEffect(() => {
        initiateTasks();
    }, []);*/

    return (
        <ScrollView style={{flex: 1}}>
            <ListItem bottomDivider onPress={() => navigation.navigate("TaskHistory")}>
                <ListItem.Content>
                    <ListItem.Title>Choose a different date</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <View style={styles.container}>
                {tasks ? tasks.map((task, id) =>
                <Task details={task} key={id} />
                ) : (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" color="#555" />
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 0,
        padding: 0
    },
    taskHolder: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});
