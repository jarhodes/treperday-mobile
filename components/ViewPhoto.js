import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
import ApiContext from '../ApiContext';

export default function ViewPhoto(props) {

    const apiVariables = React.useContext(ApiContext);
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const [belongsToPrincipal, setBelongsToPrincipal] = React.useState(false);
    const navigation = useNavigation();

    const source = {
        uri: apiVariables.apiUrl + "/api/attachment/getwithtoken/" + props.route.params.id + "/" + props.route.params.fetchToken
    };

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }

    const deletePhoto = () => {
        fetch(apiVariables.apiUrl + "/api/attachment/delete/" + props.route.params.id, {
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

    const checkPhotoPrincipal = () => {
        fetch(apiVariables.apiUrl + "/api/attachment/details/" + props.route.params.id)
            .then(response => {
                if (response.ok) {
                    setBelongsToPrincipal(true);
                }
            })
            .catch(error => console.log(error));
    }

    React.useEffect(() => {
        checkPhotoPrincipal();
    }, []);

    return (
        <ImageBackground source={source} style={styles.mainImage}>
            { belongsToPrincipal ? (
                <>
                    <Button title="Delete" onPress={toggleOverlay} />
                    <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
                        <View>
                            <Text>Do you really want to delete this photo?</Text>
                            <View style={styles.inlineButtons}>
                                <Button title="Yes" onPress={deletePhoto} />
                                <Button title="No" onPress={toggleOverlay} />
                            </View>
                        </View>
                    </Overlay>
                </>
            ) : (
                <></>
            ) }
        </ImageBackground>
    );

}

const styles = StyleSheet.create({
    imageContainer: {
        alignContent: 'flex-end'
    },
    inlineButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
        marginVertical: 40
    },
    mainImage: {
        height: '100%',
        width: null,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});