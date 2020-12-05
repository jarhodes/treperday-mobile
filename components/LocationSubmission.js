import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import LocationThumbnails from './LocationThumbnails';

export default function LocationSubmission(props) {

    const navigation = useNavigation();
    
    return(
        <View style={props.style}>
            <LocationThumbnails performanceId={props.performance.id} />
            <Button style={styles.buttonMargin} onPress={() => navigation.navigate("UserLocation", { 
                performanceId: props.performance.id,
                mapSearchKeyword: props.performance.task.mapSearchKeyword })} title="Go to map" />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonMargin: {
        marginTop: 20
    }
});