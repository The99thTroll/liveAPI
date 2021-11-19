import * as React from 'react';
import {Button, Image, View, Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    state = {
        'image': null
    }

    componentDidMount(){
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("Sorry! We need access to your camera roll!")
            }
        }
    }

    uploadImage = async (uri) => {
        const formData = new FormData();
        let fileName = uri.split("/")[uri.split('/').length - 1]
        let type = `image/${uri.split(".")[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: fileName,
            type: type
        }

        formData.append("digit", fileToUpload);

        fetch("http://3e70-2601-647-5b00-aa10-711a-e6ed-3b20-92e0.ngrok.io/predict-data", {
            method: 'POST',
            body: formData,
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then((response) => response.json())
        .then((result) => console.log('sucess ', result))
        .catch((error) => console.log(error))
    }

    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditting: true,
                aspect: [4, 3],
                quality: 1
            })

            if(!result.cancelled){
                this.setState({
                    'image': result.data
                })

                this.uploadImage(result.uri);
            }
        } catch (error) {
            console.log(error);
        }
    } 

    render(){
        let {image} = this.state;

        return <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Button title="Select an Image from Camera Roll"
            onPress={this.pickImage}/>
        </View>
    }
}