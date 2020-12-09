import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';
import AudioThumbnails from './AudioThumbnails';

export default function AudioSubmission(props) {

    const [hasRecordPermission, setRecordPermission] = React.useState(null);
    const [audio, setAudio] = React.useState({});
    const [recording, setRecording] = React.useState();
    const [fileUrl, setFileUrl] = React.useState();
    const [recordingButtonTitle, setRecordingButtonTitle] = React.useState('');
    const navigation = useNavigation();

    const initiateRecordingObject = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        setRecordPermission(status === 'granted');
        const recordObject = new Audio.Recording();
        recordObject.setOnRecordingStatusUpdate(({ durationMillis, isRecording, isDoneRecording }) => {
            setAudio({ durationMillis, isRecording, isDoneRecording });
            setRecordingButtonTitle("Recording: " + parseInt(durationMillis / 1000));
        });
        recordObject.setProgressUpdateInterval(200);
        setRecording(recordObject);
    }

    const recordAudio = async () => {
        try {
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            console.log("Recording started");
        }
        catch (error) {
            console.log(error);
        }
    }

    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            setFileUrl(recording.getURI());
            props.setAttachmentUrl(recording.getURI());
            console.log("Recording stopped. URI = " + recording.getURI());
            initiateRecordingObject();
        }
        catch (error) {
            console.log(error);
        }
    }

    const playSound = async (uri) => {
        console.log("Playback called");
        try {
            const {
                sound: soundObject,
                status,
            } = await Audio.Sound.createAsync({ uri: uri }, { shouldPlay: true });
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        initiateRecordingObject();
    }, []);

    return (
        <View>
            <AudioThumbnails performanceId={props.performance.id} />
            <View style={styles.inlineButtons}>
                { hasRecordPermission ? (
                    <>
                    { audio.isRecording ? (
                        <>
                            <Button icon={<Icon name="stop" size={24} color="white" />} title={recordingButtonTitle} buttonStyle={{ backgroundColor: "darkred" }} onPress={() => stopRecording()} />
                        </>
                    ) : (
                        <>
                        <Icon name="mic" size={24} reverse color="darkred" onPress={() => recordAudio()} />
                        { fileUrl ? (
                        <Icon name="play-arrow" size={24} reverse onPress={() => playSound(fileUrl)} />
                    ) : (<></>) }
                        </>
                    ) }
                    </>
                ) : (
                    <Text>No recording access</Text>
                ) }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inlineButtons: {
        backgroundColor: '#fff',
        color: '#555',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});