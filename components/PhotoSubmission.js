import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import AttachmentThumbnails from './AttachmentThumbnails';

export default function PhotoSubmission(props) {

    const navigation = useNavigation();

    return (
        <View style={props.style}>
            <AttachmentThumbnails performanceId={props.performance.id} />
            <Button style={styles.buttonMargin} onPress={() => navigation.navigate("CapturePhoto", { performanceId: props.performance.id })} title="Take photo" />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonMargin: {
        marginTop: 20
    }
});