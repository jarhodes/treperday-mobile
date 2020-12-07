import React from 'react';
import { Text, View, StyleSheet, Image, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Icon, Overlay } from 'react-native-elements';
import ApiContext from '../ApiContext';
import { useNavigation } from '@react-navigation/native';
import * as mime from 'react-native-mime-types';

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
            type: mime.lookup(photo.uri) || 'application/octet-stream'
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
                    <View style={styles.cameraControls}>
                        <Icon name="flip" size={24} reverse color="blue" onPress={() => capture()} />
                        <Icon name="camera" size={24} reverse color="red" onPress={() => capture()} />
                    </View>
                    </Camera>
                    <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} fullScreen={true}>
                        <View style={{ flex: 1 }}>
                            <ImageBackground source={{ uri: `data:image/jpg;base64,${photo.base64}` }} style={styles.confirmImage}>
                                <View style={styles.inlineButtons}>
                                    <Icon name="check" size={24} reverse color="green" onPress={() => putPhoto()} />
                                    <Icon name="cancel" size={24} reverse color="red" onPress={() => toggleOverlay()} />
                                </View>
                            </ImageBackground>
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
    cameraControls:  {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        padding: 0,
        marginVertical: 40        
    },
    inlineButtons: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
        marginVertical: 40
    },
    confirmImage: {
        height: '100%',
        width: null,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});