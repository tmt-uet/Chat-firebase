import React, { Component } from 'react';
import { View,Text,TouchableOpacity} from 'react-native';
import { LoginButton } from 'react-native-fbsdk';
import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyAIP8Ug0OqI5Rxv29HK8hMYTWNrgG8Yvoc",
    authDomain: "chat-app-87fd5.firebaseapp.com",
    databaseURL: "https://chat-app-87fd5.firebaseio.com",
    projectId: "chat-app-87fd5",
    storageBucket: "chat-app-87fd5.appspot.com",
    messagingSenderId: "1096520825590"
  };
firebaseApp= firebase.initializeApp(config)

export default class TestFireBase extends Component {
  constructor(props){
    super(props);
  }
  // componentWillMount(){
  //   firebaseApp.database().ref(`/users/${A1i50YJQv3dpLFxu8neBJdk5lrF2}/profile`).set({
  //     name: "tung",
  //     email: "tungmin2410",
      
  //   });
  // }
  setDB(){
    const itemRef=firebaseApp.database().ref('users/'+'IvIdu8u6wiRH30e97JxVuaPmyUH2');

    itemRef.set({
      username:'tmt',
      email:'linhmin178',
      class:'funny'
    })
  }
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.setDB}>
          <Text>Set database</Text>
        </TouchableOpacity>
        
      </View>
    );
  }
};
