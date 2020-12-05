import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Overlay } from 'react-native-elements';

export default function TextThumbnail(props) {

    const [overlayVisible, setOverlayVisible] = React.useState(false);
    
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }

    return (
        <>
            <Icon name="subject" size={15} reverse onPress={toggleOverlay} />
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
                <View>
                    <Text>{props.performance.performanceText}</Text>
                    <View style={styles.inlineButtons}>
                        <Button title="Close" onPress={toggleOverlay} />
                    </View>
                </View>
            </Overlay>
        </>
    );
}

const styles = StyleSheet.create({
    inlineButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
        marginVertical: 40
    }
});