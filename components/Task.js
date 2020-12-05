import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import CommunityThumbnails from './CommunityThumbnails';
import UserThumbnails from './UserThumbnails';

export default function Task(props) {

    const navigation = useNavigation();

    console.log("Task called");
    console.log(props.details);
    return (
        <Pressable onPress={() => navigation.navigate("Activity", { id: props.details.id })}>
            <View style={styles.container}>
                <ImageBackground source={{ uri: props.details.task.category.backgroundPic }} style={styles.headerImage}>
                    <View style={styles.overlay}>
                        <Text style={styles.greyText, styles.activityName}>{props.details.task.name}</Text>
                        <Text style={styles.greyText, styles.categoryName}>{props.details.task.category.name}</Text>
                    </View>
                    <View style={styles.inline}>
                        <UserThumbnails performance={props.details} />
                        <CommunityThumbnails task={props.details.task} />
                    </View>
                </ImageBackground>
            </View>
        </Pressable>
    );
}

const greyText = '#555';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: Dimensions.get('screen').width,
        marginVertical: 5,
        padding: 0,
        color: greyText
    },
    headerImage: {
        alignSelf: 'stretch'
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        padding: 10
    },
    greyText: {
        color: greyText
    },
    detailText: {
        padding: 10,
        color: greyText
    },
    thumbnail: {
        width: 50,
        height: 50
    },
    activityName: {
        fontSize: 22
    },
    categoryName: {
        fontSize: 16
    },
    inline: {
        flexDirection: 'row',
        width: '100%'
    }
});