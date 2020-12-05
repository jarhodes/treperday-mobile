import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ApiContext from '../ApiContext';
import AttachmentThumbnail from './AttachmentThumbnail';

export default function AttachmentThumbnails(props) {

    const apiVariables = React.useContext(ApiContext);
    const [attachments, setAttachments] = React.useState([]);

    const fetchAttachmentList = (performanceId) => {
        fetch(apiVariables.apiUrl + "/api/attachment/list/" + performanceId)
            .then(response => response.text())
            .then(responseText => {
                if (responseText.length) {
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Empty");
                }
            })
            .then(responseJson => {
                console.log("Received attachment list = " + JSON.stringify(responseJson));
                setAttachments(responseJson);
            })
            .catch(error => console.log(error));
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchAttachmentList(props.performanceId);
        }, [])
    );

    return (
        <View style={styles.container}>
            { attachments ? attachments.map((attachment, id) =>
            <AttachmentThumbnail attachment={attachment} setAttachments={setAttachments} key={id} />) : <></>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        color: '#555',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    thumbnail: {
        maxHeight: 50,
        maxWidth: 50
    }
});