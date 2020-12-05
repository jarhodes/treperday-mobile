import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import ApiContext from '../ApiContext';
import Task from './Task';
import Moment from 'moment';

export default function TaskScreen(props) {

    const apiVariables = React.useContext(ApiContext);
    const [tasks, setTasks] = React.useState([]);
    const navigation = useNavigation();
    
    const getTasks = () => {
        let taskDate;
        let useToday;
        // If no date is provided in the props, use today
        if (props.route && props.route.params && props.route.params.date) {
            console.log("props route params date is " +props.route.params.date);
            taskDate = new Date(props.route.params.date);
            const dateString = Moment(taskDate).format("D.M.YYYY")
            navigation.setOptions({ title: "Activities - " + dateString });
            useToday = false;
        }
        else {
            taskDate = new Date();
            navigation.setOptions({ title: "Today's activities" });
            useToday = true;
        }

        console.log("date is "+taskDate.toISOString());

        // Fetch tasks from the server
        console.log("fetchign tasks");

        // Date in format YYYY-MM-DD
        const serverDate = taskDate.toISOString().substring(0, 10);
        console.log("serverDate is "+serverDate);

        // Preassemble task object
        let taskObject = {
            date: serverDate,
            tasklist: {}
        };

        console.log("fetching "+ apiVariables.apiUrl + "/api/task/tasksbydate?date="+serverDate);
        console.log("Auth variables are " + JSON.stringify(apiVariables.authHeaders));

        fetch(apiVariables.apiUrl + "/api/task/tasksbydate?date="+serverDate)
            .then(response => response.text())
            .then(responseText => {
                if (responseText.length) {
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("No tasks yet assigned")
                }
            })
            .then(responseJson => {
                console.log("Success. REceived: " + JSON.stringify(responseJson));
                setTasks(responseJson);
            })
            .catch(error => {
                console.log(error);
                fetch(apiVariables.apiUrl + "/api/task/assignthree", {
                    method: 'POST',
                    headers: apiVariables.authHeaders
                })
                    .then(response => response.json())
                    .then(responseJson => setTasks(responseJson))
                    .catch(error => console.log(error));
            });
    }

    useFocusEffect(
        React.useCallback(() => {
            getTasks();
        }, [])
    );

    return (
        <View style={{flex: 1}}>
            <ListItem bottomDivider onPress={() => navigation.navigate("TaskHistory")}>
                <ListItem.Content>
                    <ListItem.Title>Choose a different date</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <View style={styles.container}>
                {tasks ? tasks.map((task, id) =>
                <Task details={task} key={id} />) : <Text>Loading</Text>}
            </View>
        </View>
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
    }
});
