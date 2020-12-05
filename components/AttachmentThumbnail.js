import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Card, Image, Text } from 'react-native-elements';
import ApiContext from '../ApiContext';

export default function AttachmentThumbnail(props) {

    const apiVariables = React.useContext(ApiContext);
    const navigation = useNavigation();

    const source = {
        uri: apiVariables.apiUrl + "/api/attachment/getwithtoken/" + props.attachment.id + "/" + props.attachment.fetchToken
    }

    return (
        <Pressable onPress={() => navigation.navigate("ViewPhoto", { id: props.attachment.id, fetchToken: props.attachment.fetchToken })}>
            <Image source={source} style={styles.thumbnail} resizeMethod="scale" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    thumbnail: {
        width: 50,
        height: 50,
        margin: 0,
        padding: 0
    }
});