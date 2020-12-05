import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Overlay } from 'react-native-elements';
import ApiContext from '../ApiContext';
import { useNavigation } from '@react-navigation/native';

export default function CapturePhoto(props) {

    const apiVariables = React.useContext(ApiContext);
    const [hasCameraPermission, setCameraPermission] = React.useState(null);
    const [type, setType] = React.useState(Camera.Constants.Type.back);
    const [photo, setPhoto] = React.useState({});
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const navigation = useNavigation();
    
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }

    const camera = React.useRef(null);

    const capture = async () => {
        if (camera) {
            const capturedPhoto = await camera.current.takePictureAsync({ base64: true });
            setPhoto(capturedPhoto);
            toggleOverlay();
        }
    }

    const flipCamera = () => {
        setType(type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back);
    }

    const putPhoto = async () => {
        console.log("Posting photo to performance ID = " + props.route.params.performanceId);
        const filename = photo.uri.split('/').pop();
        const data = new FormData();
        data.append('file', {
            uri: photo.uri,
            name: filename,
            type: 'image/jpg'
        });
        console.log(data);
        fetch(apiVariables.apiUrl + "/api/attachment/addtoperformance/" + props.route.params.performanceId, {
            method: 'POST',
            body: data
        })
            .then(response => {
                if (response.ok) {
                    navigation.goBack();
                }
                else {
                    toggleOverlay();
                    return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
                }
            })
            .catch(error => console.log(error));
    }

    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setCameraPermission(status === 'granted');
        })();
    }, []);

    return (
        <View style={styles.cameraContainer}>
            { hasCameraPermission ? (
                <>
                    <Camera style={styles.camera} ref={camera} type={type}>
                    <View style={styles.inlineButtons}>
                        <Button title="Take photo" onPress={capture} />
                        <Button title="Flip" onPress={flipCamera} />
                    </View>
                    </Camera>
                    <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} fullScreen={true}>
                        <View style={{ flex: 1 }}>
                            <Image style={{ flex: 12, width: null }} source={{ uri: `data:image/jpg;base64,${photo.base64}` }} />
                            <View style={styles.inlineButtons}>
                                <Button title="No" onPress={toggleOverlay} />
                                <Button title="Yes" onPress={putPhoto} />
                            </View>
                        </View>
                    </Overlay>
                </>
            ) : (
                <Text>No camera access</Text>
            ) }
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1
    },
    camera: {
        flex: 1,
        flexDirection: 'row'
    },
    inlineButtons: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
        marginVertical: 40
    }
});