import React, { Component } from 'react';
import { View,Text,TouchableOpacity,Image} from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
// import firebase from 'firebase';
// const config = {
//     apiKey: "AIzaSyAIP8Ug0OqI5Rxv29HK8hMYTWNrgG8Yvoc",
//     authDomain: "chat-app-87fd5.firebaseapp.com",
//     databaseURL: "https://chat-app-87fd5.firebaseio.com",
//     projectId: "chat-app-87fd5",
//     storageBucket: "chat-app-87fd5.appspot.com",
//     messagingSenderId: "1096520825590"
//   };
// firebaseApp= firebase.initializeApp(config)
import ImagePicker from 'react-native-image-picker';

var options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class TestFireBase extends Component {
  constructor(props){
    super(props);
    this.state={
      avatarSource: null,
    }
  }
  // componentWillMount(){
  //   firebaseApp.database().ref(`/users/${A1i50YJQv3dpLFxu8neBJdk5lrF2}/profile`).set({
  //     name: "tung",
  //     email: "tungmin2410",
      
  //   });
  // }

  pickImage(){
  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);
  
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = { uri: response.uri };
      console.log("anh day nayyyyyyyyy     "+source.uri)
      // console.log(source)
  
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
  
      this.setState({
        avatarSource: source,
      });
    }
  });

} 

  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>{this.pickImage()}}>
          <Image source={this.state.avatarSource} style={{height:150,width:120}}/>
          <Text style={{color:'green',fontSize:30}}>Upload File</Text>
        </TouchableOpacity>
        
      </View>
    );
  }
};
