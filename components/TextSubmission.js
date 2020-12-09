import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import ApiContext from '../ApiContext';

export default function TextSubmission(props) {

    return (
        <View style={props.style}>
            <Input multiline={true} placeholder="Your notes" label="Your notes" value={props.performance.performanceText} 
                onChangeText={text => props.setPerformance({...props.performance, performanceText: text})}  />
            {props.commonFields}
        </View>
    );
}

const styles = StyleSheet.create({
    inline: {
        flex: 1,
        flexDirection: 'row',
    },
    column: {
        flex: 1
    },
    switchHolder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 0,
        marginVertical: 40
    },
    textArea: {
        backgroundColor: '#EEE'
    }
})