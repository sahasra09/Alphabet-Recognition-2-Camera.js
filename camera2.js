import React from "react";
import {View,Button,Platform} from "react-native";
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"

export default class PickImage extends React.Component{
    state={
        image:null
    }
    render(){
        let{image}=this.state
        return(
            <View style={{justifyContent:"center",alignItems:"center",alignContent:"center",marginTop:200}}>
                <Button 
                title="Pick an image from gallery"
                onPress={this._pickImage}
                />
            </View>
        )
    }
    componentDidMount(){
        this.getPermissionsAsync()
    }
    getPermissionsAsync=async()=>{
        if(Platform.OS!=="web"){
            const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=="granted"){
                alert("Sorry,we need camera permissions to make the app work")
            }
        }
    }
    _pickImage=async()=>{
        try{
            let result=await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({
                    image:result.data
                })
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }
    uploadImage=async(uri)=>{
        const data=new FormData()
        let fileName=uri.split("/")[uri.split("/").length-1]
        let type=`image/${uri.split(".")[uri.split(".").length-1]}`
        const fileToUpload={
            uri:uri,
            name:fileName,
            type:type
        }
        data.append("digit",fileToUpload)
        fetch("https://f292a3137990.ngrok.io/predict-digit",{
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((response)=>response.json())
        .then((result)=>{
            console.log("Success:",result)
        })
        .catch((error)=>{
            console.error("Error:",error)
        })
    }
}
