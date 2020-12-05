import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import ApiContext from '../ApiContext';
import { useNavigation } from '@react-navigation/native';
import Moment from 'moment';

export default function TaskHistory(props) {

    const apiVariables = React.useContext(ApiContext);
    const [dates, setDates] = React.useState([]);
    const navigation = useNavigation();

    const fetchDates = () => {
        console.log("Fetching dates");
        fetch(apiVariables.apiUrl + "/api/task/list/taskdates")
            .then(response => response.text())
            .then(responseText => {
                if (responseText.length) {
                    console.log(JSON.parse(responseText));
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Empty response");
                }
            })
            .then(responseJson => setDates(responseJson))
            .catch(error => console.log(error));
    }

    React.useEffect(() => {
        fetchDates();
    }, []);

    return (
        <View>
            { dates ? dates.map((item, key) => 
                <ListItem key={key} bottomDivider onPress={() => navigation.push("TaskScreen", { date: item.date })}>
                    <ListItem.Content>
                        <ListItem.Title>{Moment(item.date).format("D.M.YYYY")}</ListItem.Title>
                        {item.list.map((performance, key) =>
                            <ListItem.Subtitle key={key}>{performance.task.category.name}</ListItem.Subtitle> )}
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ) : ( 
                <ListItem bottomDivider onPress={() => navigation.navigate("TaskScreen")}>
                    <ListItem.Content>
                        <ListItem.Title>{Moment(new Date()).format("D.M.YYYY")}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
             ) }
        </View>
    );
}

const styles = StyleSheet.create({
    listItemText: {
        paddingRight: 10,
    }
});