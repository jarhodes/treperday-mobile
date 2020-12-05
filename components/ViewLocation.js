import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Overlay, Text } from 'react-native-elements';
import MapView, { Callout, Marker } from 'react-native-maps';
import ApiContext from '../ApiContext';

export default function ViewLocation(props) {

    const apiVariables = React.useContext(ApiContext);
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const [locationOk, setLocationOk] = React.useState(false);
    const [belongsToPrincipal, setBelongsToPrincipal] = React.useState(false);
    const navigation = useNavigation();

    const [markerCoordinates, setMarkerCoordinates] = React.useState({
        // Places a marker at Haaga-Helia UAS
        latitude: 60.201323, 
        longitude: 24.933979
    });

    const [region, setRegion] = React.useState({
        // Centres the map on Pasila to begin with
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
    });
    
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }

    const getLocation = (id) => {
        const success = false;
        fetch(apiVariables.apiUrl + "/api/location/" + id)
            .then(response => response.text())
            .then(responseText => {
                if (responseText.length) {
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
                }
            })
            .then(responseJson => {
                console.log(JSON.stringify(responseJson));
                setRegion({ ...region, latitude: responseJson.latitude, longitude: responseJson.longitude });
                setMarkerCoordinates({ latitude: responseJson.latitude, longitude: responseJson.longitude });                
                setLocationOk(true);
                setBelongsToPrincipal(true);
                success = true;
            })
            .catch(error => console.log(error));
        
            if (!success) {
                fetch(apiVariables.apiUrl + "/api/location/community/" + id)
                    .then(response => response.text())
                    .then(responseText => {
                        if (responseText.length) {
                            return JSON.parse(responseText);
                        }
                        else {
                            return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
                        }
                    })
                    .then(responseJson => {
                        console.log(JSON.stringify(responseJson));
                        setRegion({ ...region, latitude: responseJson.latitude, longitude: responseJson.longitude });
                        setMarkerCoordinates({ latitude: responseJson.latitude, longitude: responseJson.longitude });                
                        setLocationOk(true);
                    })
                    .catch(error => console.log(error));
            }
    }

    const deleteLocation = () => {
        fetch(apiVariables.apiUrl + "/api/location/" + props.route.params.id, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    navigation.goBack();
                }
                else {
                    return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
                }
            })
            .catch(error => console.log(error));
    }

    React.useEffect(() => {
        getLocation(props.route.params.id);
    }, []);

    return (
        <View style={styles.container}>
            { locationOk ? (
                <>
                    <MapView style={styles.map} region={region} showsMyLocationButton={true} showsUserLocation={true}>
                        <MapView.Marker coordinate={markerCoordinates}>
                            <MapView.Callout>
                                <Text>You were here</Text>
                            </MapView.Callout>
                        </MapView.Marker>
                    </MapView>
                    { belongsToPrincipal ? (
                        <View style={styles.deleteContainer}>
                            <Button title="Delete this location" onPress={toggleOverlay} />
                            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
                                <View>
                                    <Text>Do you really want to delete this location?</Text>
                                    <View style={styles.inlineButtons}>
                                        <Button title="Yes" onPress={deleteLocation} />
                                        <Button title="No" onPress={toggleOverlay} />
                                    </View>
                                </View>
                            </Overlay>
                        </View>
                    ) : ( <></> ) }
                </>
            ) : (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#555" />
               </View>
            ) }
        </View>  
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    inlineButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
        marginVertical: 40
    },
    deleteContainer: {
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: 0,
        right: 0
    }
});