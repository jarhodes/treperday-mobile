import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Accessory, Avatar, Button, Icon, Image, Input, Overlay, Text } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ApiContext from '../ApiContext';
import images from '../assets';

export default function Profile(props) {
    
    const apiVariables = React.useContext(ApiContext);
    const [firstName, setFirstName] = React.useState(apiVariables.user.firstName);
    const [lastName, setLastName] = React.useState(apiVariables.user.lastName);
    const [avatarIcon, setAvatarIcon] = React.useState(apiVariables.user.avatarIcon);
    const [avatarColour, setAvatarColour] = React.useState(apiVariables.user.avatarColour);
    const [initials, setInitials] = React.useState();
    const [overlayVisible, setOverlayVisible] = React.useState(false);

    const availableIcons = [
        "anchor", "angry", "apple-alt", "baby", "basketball-ball", "beer", "biohazard", "birthday-cake",
        "bomb", "book-open", "bug", "bullhorn", "burn", "candy-cane", "car-alt", "carrot", "cat",
        "chess-knight", "child", "cloud", "cocktail", "coffee", "cookie-bite", "crow",
        "dizzy", "dog", "dove", "dragon", "drum", "feather-alt", "female", "fighter-jet",
        "fish", "futbol", "grimace", "grin-alt", "grin-beam", "grin-hearts", "grin-squint",
        "grin-stars", "grin-tears", "grin-wink", "guitar", "hamburger"
    ];

    const availableColours = [
        "darkgoldenrod", "darkgreen", "darkorange", "darkorchid", "darkred", "darkslateblue", "darkseagreen",
        "deeppink", "lightblue", "lightcoral", "lightgreen", "lightpink", "lightseagreen", "midnightblue"
    ];

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }

    const putUser = () => {
        const putObject = {
            lastName: lastName,
            firstName: firstName,
            avatarIcon: avatarIcon,
            avatarColour: avatarColour
        };
        const headers = apiVariables.authHeaders;
        fetch(apiVariables.apiUrl + "/api/user/update", {
            method: 'PUT',
            headers: { headers,
                'Content-Type': 'application/json' },
            body: JSON.stringify(putObject)
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                else {
                    return Promise.reject("Response not OK");
                }
            })
            .then(responseText => {
                if (responseText.length) {
                    return JSON.parse(responseText);
                }
                else {
                    return Promise.reject("Response not OK");
                }
            })
            .then(responseJson => apiVariables.setUser(responseJson))
            .catch(error => console.log(error));

    }

    const confirmAvatar = (name) => {
        setAvatarIcon(name);
        toggleOverlay();
    }

    const updateFirstName = (text) => {
        setFirstName(text);
        getInitials(text, lastName);
    }

    const updateLastName = (text) => {
        setLastName(text);
        getInitials(firstName, text);
    }

    const getInitials = (firstName, lastName) => {
        let firstInitial;
        let lastInitial;
        if (firstName) {
            firstInitial = firstName.charAt(0);
        }
        else {
            firstInitial = "";
        }
        if (lastName) {
            lastInitial = lastName.charAt(0);
        }
        else {
            lastInitial = "";
        }
        setInitials(firstInitial+lastInitial);
    };

    React.useEffect(() => {
        getInitials(apiVariables.user.firstName, apiVariables.user.lastName);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.avatarHolder}>
                { avatarIcon ? (
                <Avatar size="large" icon={{ type: "font-awesome-5", name: avatarIcon }} rounded containerStyle={{ backgroundColor: avatarColour }}
                    onPress={toggleOverlay} onAccessoryPress={toggleOverlay} />
                ) : (
                <Avatar size="large" rounded title={initials} activeOpacity={0.7} titleStyle={{ color: "white" }} 
                    containerStyle={{ backgroundColor: avatarColour }} onPress={toggleOverlay} onAccessoryPress={toggleOverlay}>
                    <Accessory size={18} />
                </Avatar>
                )}
                <Text style={styles.avatarName}>{firstName} {lastName}</Text>
            </View>
            <Input placeholder="First name" label="First name" value={firstName} onChangeText={text => updateFirstName(text)} />
            <Input placeholder="Last name" label="Last name" value={lastName} onChangeText={text => updateLastName(text)} />
            <Icon name="check" size={24} reverse color="darkgreen" onPress={() => putUser()} />
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} style={styles.overlay}>
                <View>
                    <Text h4>Choose a colour</Text>
                    <View style={styles.avatarSelector}>
                        {availableColours.map((item, key) => 
                        <Avatar rounded containerStyle={{ backgroundColor: item }} key={key} onPress={() => setAvatarColour(item)} />)}
                    </View>
                    <Text h4>Choose an avatar picture</Text>
                    <View style={styles.avatarSelector}>
                        {availableIcons.map((item, key) => 
                        <Avatar icon={{ type: "font-awesome-5", name: item }} rounded key={key} containerStyle={{ backgroundColor: avatarColour}} onPress={() => setAvatarIcon(item)} /> )}
                    </View>
                    <Icon name="check" size={24} reverse color="darkgreen" onPress={toggleOverlay} />
                </View>
            </Overlay>
        </View>
    );
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
    avatarHolder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        marginVertical: 50
    },
    overlay: {
        padding: 20
    }, 
    avatarName: {
        fontSize: 24,
        marginLeft: 20
    },
    avatarSelector: {
        marginVertical: 20,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});