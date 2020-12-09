import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button, Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import ApiContext from '../ApiContext';

export default function UserLocation(props) {

    const apiVariables = React.useContext(ApiContext);
    const [locationOk, setLocationOk] = React.useState(false);
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const [markers, setMarkers] = React.useState([]);
    const [region, setRegion] = React.useState({
        // Centres the map on Pasila to begin with
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
    });
    const navigation = useNavigation();

    const getLocation = async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("You cannot complete this activity because you have not given permission to access your location");
            navigation.goBack();
        }
        else {
            let currentLocation = await Location.getCurrentPositionAsync({});
            setRegion({ ...region, latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude });
            console.log(JSON.stringify(currentLocation));
            setLocationOk(true);
            if (props.route.params.mapSearchKeyword !== null) {
                getMarkers(props.route.params.mapSearchKeyword, currentLocation.coords.latitude, currentLocation.coords.longitude);
            }
        }
    }

    const getMarkers = (keyword, lat, lng) => {
        // Google Places API
        const placesUri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + 
        "&radius=1500&type=" + encodeURIComponent(keyword) + "&key=" + apiVariables.googleApiKey;
        console.log(placesUri);
        fetch(placesUri)
            .then(response => response.json())
            .then(jsonResponse => {
                setMarkers(jsonResponse.results);
            })
            .catch(error => console.log(error));
    }

    const putLocation = async () => {
        setOverlayVisible(true);
        let currentLocation = await Location.getCurrentPositionAsync({});
        const locationPutObject = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
        }
        const headers = 
        fetch(apiVariables.apiUrl + "/api/location/addtoperformance/" + props.route.params.performanceId, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationPutObject)
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
        getLocation();
    }, []);

    return (
        <>
        { locationOk ? (
            <View style={styles.container}>
                <MapView style={styles.map} region={region} showsMyLocationButton={true} showsUserLocation={true}>
                    { markers.map( (marker, index) => 
                        <Marker
                            key={index}
                            coordinate={{latitude: marker.geometry.location.lat, longitude: marker.geometry.location.lng}}
                            title={marker.name}
                            description={marker.vicinity} /> ) }
                </MapView>
                <View>
                    <Button title="Save my location" onPress={putLocation} />
                    <Overlay isVisible={overlayVisible}>
                        <ActivityIndicator size="large" color="#555" />
                  </Overlay>
                </View>
            </View>
        ) : (
            <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#555" />
            </View>
        ) }
        </>
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
    }
});