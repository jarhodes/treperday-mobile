import React from 'react';
import AttachmentThumbnails from './AttachmentThumbnails';
import LocationThumbnails from './LocationThumbnails';
import AudioThumbnails from './AudioThumbnails';
import TextThumbnail from './TextThumbnail';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

export default function UserThumbnails(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.containerText}>Your activity</Text>
            <View style={styles.innerContainer}>
            {
                {
                    'photo': <AttachmentThumbnails performanceId={props.performance.id} />,
                    'audio': <AudioThumbnails performanceId={props.performance.id} />,
                    'location': <LocationThumbnails performanceId={props.performance.id} />
                }[props.performance.task.category.submissionType]
                || <TextThumbnail performance={props.performance} />
            }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fee',
        color: '#555',
        margin: 10,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        flex: 2,
        alignContent: 'center',
        alignItems: 'center'
    },
    innerContainer: {
        backgroundColor: '#fee',
        color: '#555',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center'
    },
    containerText: {
        marginBottom: 5
    }
});