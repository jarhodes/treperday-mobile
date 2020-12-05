import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import ApiContext from '../ApiContext';

export default function TextSubmission(props) {

    const apiVariables = React.useContext(ApiContext);
    const [text, setText] = React.useState(props.performance.performanceText);
    const navigation = useNavigation();

    return (
        <View style={props.style}>
            <TextInput multiline={true} placeholder="Your notes" value={props.performance.performanceText} 
                onChangeText={text => props.setPerformance({...props.performance, performanceText: text})} 
                style={styles.textArea} />
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