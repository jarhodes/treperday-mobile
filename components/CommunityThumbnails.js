import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import ApiContext from '../ApiContext';
import CommunityThumbnail from './CommunityThumbnail';

export default function CommunityThumbnails(props) {

    const apiVariables = React.useContext(ApiContext);
    const [thumbnails, setThumbnails] = React.useState([]);

    const getThumbnails = () => {
        let uri;
        switch (props.task.category.submissionType) {
            case 'location':
                uri = apiVariables.apiUrl + "/api/community/locationsbytask/" + props.task.id;
                break;
            case 'photo':
            case 'audio':
                uri = apiVariables.apiUrl + "/api/community/attachmentsbytask/" + props.task.id;
                break;
            case 'text':
                uri = apiVariables.apiUrl + "/api/community/performancesbytask/" + props.task.id;
                break;
        }

        fetch(uri)
            .then(response => response.text())
            .then(responseText => {
                if (responseText.length) {
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Status: " + response.status + " " + responseText);
                }
            })
            .then(responseJson => setThumbnails(responseJson))
            .catch(error => console.log(error));
    }

    useFocusEffect(
        React.useCallback(() => {
            getThumbnails();
        }, [])
    );

    return (
        <View style={styles.container}>
            { thumbnails ? (
                <>
                    <Text style={styles.containerText}>Other people</Text>
                    <View style={styles.innerContainer}>
                    { thumbnails.map((thumbnail, id) =>
                        <CommunityThumbnail thumbnail={thumbnail} submissionType={props.task.category.submissionType} key={id} />) }
                    </View>
                </>
            ) : <></> }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eef',
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
        backgroundColor: '#eef',
        color: '#555',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center'
    },
    containerText: {
        marginBottom: 5
    }
});