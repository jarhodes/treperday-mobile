import React from 'react';
import { Button } from 'react-native-elements';
import AttachmentThumbnail from './AttachmentThumbnail';
import AudioThumbnail from './AudioThumbnail';
import TextThumbnail from './TextThumbnail';

export default function CommunityThumbnail(props) {

    console.log("Thumbnail passed to CommunityThumb is:");
    console.log(props.thumbnail);

    switch (props.submissionType) {
        case 'photo':
            return <AttachmentThumbnail attachment={props.thumbnail} />
        case 'audio':
            return <AudioThumbnail attachment={props.thumbnail} />
        case 'location':
            return <Button title="Map" onPress={() => navigation.navigate("ViewLocation", { id: props.thumbnail.id })} />
        case 'text':
            return <TextThumbnail performance={props.thumbnail} />
    }

}