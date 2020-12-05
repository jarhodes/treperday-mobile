import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, StyleSheet, Switch, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import ApiContext from '../ApiContext';
import AudioSubmission from './AudioSubmission';
import LocationSubmission from './LocationSubmission';
import PhotoSubmission from './PhotoSubmission';
import TextSubmission from './TextSubmission';
import * as mime from 'react-native-mime-types';

export default function Performance(props) {

    const apiVariables = React.useContext(ApiContext);
    const [performance, setPerformance] = React.useState({});
    const [attachmentUrl, setAttachmentUrl] = React.useState('');
    const navigation = useNavigation();

    const { id } = props.route.params;

    const getPerformance = (id) => {
        console.log("Getting performance " + id);

        fetch(apiVariables.apiUrl + "/api/performance/" + id, {
            method: 'GET',
            headers: apiVariables.authHeaders
        })
            .then(response => response.text())
            .then(responseText => {
                if (responseText.length) {
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
                }
            })
            .then(responseJson => {
                console.log("Received "+JSON.stringify(responseJson));
                setPerformance(responseJson);    
            })
            .catch(error => console.log(error));
    }

    const putPerformance = () => {
        const headers = apiVariables.authHeaders;
        const savePerformance = {...performance, isCompleted: true};
        setPerformance(savePerformance);

        fetch(apiVariables.apiUrl + "/api/performance/" + id, { 
            method: 'PUT',
            headers: { headers,
                'Content-Type': 'application/json' },
            body: JSON.stringify(savePerformance)
        })
        .then(response => {
            if (response.ok) {
                postAttachment();
            }
            else {
                return Promise.reject("Status: " + response.status + " " + JSON.stringify(response.json()));
            }
        })
        .catch(error => console.log(error));
    }

    const postAttachment = () => {
        if (attachmentUrl) {
            console.log("Posting attachment to performance ID = " + id);
            const filename = attachmentUrl.split('/').pop();
            console.log("Uri = " + attachmentUrl + " and filename = " + filename + " and MIME type = " + mime.lookup(attachmentUrl));
            const data = new FormData();
            data.append('file', {
                uri: attachmentUrl,
                name: filename,
                type: mime.lookup(attachmentUrl) || 'application/octet-stream'
            });
            console.log(data);
            fetch(apiVariables.apiUrl + "/api/attachment/addtoperformance/" + id, {
                method: 'POST',
                body: data
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
        else {
            navigation.goBack();
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getPerformance(id);
        }, [])
    );

    return (
        <View>
            { performance.task ? (
                <View style={styles.container}>
                    <ImageBackground source={{ uri: performance.task.category.backgroundPic }} style={styles.headerImage}>
                        <View style={styles.overlay}>
                            <Text h2 style={styles.greyText}>{performance.task.name}</Text>
                            <Text h4 style={styles.greyText}>{performance.task.category.name}</Text>
                        </View>
                    </ImageBackground>
                    <Text style={styles.detailText}>{performance.task.description}</Text>
                    {
                        {
                            'photo': <PhotoSubmission style={styles.detailText} performance={performance}
                                setPerformance={setPerformance} />,
                            'location': <LocationSubmission style={styles.detailText} performance={performance} />,
                            'audio': <AudioSubmission style={styles.detailText} performance={performance} setAttachmentUrl={setAttachmentUrl} />
                        }[performance.task.category.submissionType]
                        || <TextSubmission style={styles.detailText} performance={performance} setPerformance={setPerformance} />
                    }
                    <View style={styles.switchHolder}>
                        <Text>Share this with other TrePerDay users</Text>
                        <Switch value={performance.isShared} onValueChange={() => setPerformance({...performance, isShared: !performance.isShared})} />
                    </View>
                    <Button title="Save my activity" onPress={() => putPerformance()} />
                </View> ) : ( 
            <></> ) }
     </View>);

}

const greyText = '#555';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: '90%',
        margin: 20,
        padding: 0,
        color: greyText
    },
    headerImage: {
        alignSelf: 'stretch'
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10
    },
    greyText: {
        color: greyText
    },
    detailText: {
        padding: 10,
        color: greyText
    },
    switchHolder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 40
    }
});