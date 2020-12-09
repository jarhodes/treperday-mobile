import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import ApiContext from '../ApiContext';

export default function LocationThumbnails(props) {

    const apiVariables = React.useContext(ApiContext);
    const [locations, setLocations] = React.useState([]);
    const navigation = useNavigation();

    const fetchLocationList = (performanceId) => {
        fetch(apiVariables.apiUrl + "/api/location/list/" + performanceId)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                else {
                    return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
                }
            })
            .then(responseText => {
                if (responseText.length) {
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Empty response");
                }
            })
            .then(responseJson => {
                console.log("Received attachment list = " + JSON.stringify(responseJson));
                setLocations(responseJson);
            })
            .catch(error => console.log(error));
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchLocationList(props.performanceId);
        }, [])
    );

    return (
        <View style={styles.container}>
            { locations ? locations.map((location, id) =>
            <Icon name="place" key={id} size={15} reverse onPress={() => navigation.navigate("ViewLocation", { id: location.id })} />) : <></>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        color: '#555',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    thumbnail: {
        maxHeight: 50,
        maxWidth: 50
    }
});