import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Overlay, Text } from 'react-native-elements';
import ApiContext from '../ApiContext';

export default function AudioThumbnail(props) {

    const apiVariables = React.useContext(ApiContext);
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const [belongsToPrincipal, setBelongsToPrincipal] = React.useState(false);
    const navigation = useNavigation();
    
    const uri = {
        uri: apiVariables.apiUrl + "/api/attachment/getwithtoken/" + props.attachment.id + "/" + props.attachment.fetchToken
    };

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }

    const playSound = async () => {
        await Audio.setIsEnabledAsync(true);
        const sound = new Audio.Sound();
        await sound.loadAsync(uri);
        await sound.playAsync();
    }

    const deleteAttachment = () => {
        fetch(apiVariables.apiUrl + "/api/attachment/delete/" + props.attachment.id, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    props.fetchAttachmentList(props.attachment.performance.id);
                }
                else {
                    return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
                }
            })
            .catch(error => console.log(error));
    }

    const checkAudioPrincipal = () => {
        fetch(apiVariables.apiUrl + "/api/attachment/details/" + props.attachment.id)
            .then(response => {
                if (response.ok) {
                    setBelongsToPrincipal(true);
                }
                else {
                    return Promise.reject("Does not belong to principal");
                }
            })
            .catch(error => console.log(error));
    }

    React.useEffect(() => {
        checkAudioPrincipal();
    }, []);

    return (
        <View style={styles.container}>
            <Icon name="play-arrow" size={15} reverse onPress={playSound} />
            { belongsToPrincipal ? (
                <>
                    <Icon name="delete" size={15} reverse color="red" onPress={toggleOverlay} />
                    <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
                        <View>
                            <Text>Do you really want to delete this?</Text>
                            <View style={styles.inlineButtons}>
                                <Button title="Yes" onPress={deleteAttachment} />
                                <Button title="No" onPress={toggleOverlay} />
                            </View>
                        </View>
                    </Overlay>
                </>
            ) : ( <></> ) }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        color: '#555',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    inlineButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
        marginVertical: 40
    }
})