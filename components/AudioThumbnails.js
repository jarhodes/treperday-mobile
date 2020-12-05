import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ApiContext from '../ApiContext';
import AudioThumbnail from './AudioThumbnail';

export default function AudioThumbnails(props) {

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
                    return Promise.reject("Empty response");
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
        <>
            { attachments ? attachments.map((attachment, id) =>
                <AudioThumbnail attachment={attachment} fetchAttachmentList={fetchAttachmentList} key={id} />) : <></>}
        </>
    );
}

const styles = StyleSheet.create({
    thumbnail: {
        maxHeight: 50,
        maxWidth: 50
    }
});