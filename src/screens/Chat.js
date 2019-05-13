import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Button,
  TextInput
} from "react-native";
import { StackNavigator } from "react-navigation";
import { GiftedChat } from "react-native-gifted-chat";
import ImagePicker from 'react-native-image-picker';
import propTypes from "prop-types";

import NavigationBar from "react-native-navbar";
var options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var name, uid, email;         //luu thong tin cuar thang trong room chat
import FirebaseSvc from '../FirebaseSvc'

export default class Chat extends React.Component {
//   static propTypes = {
//     user: propTypes.object,
// };
  constructor(props){
    super(props)
    state = {
      messages: [],
    }
    this.user=FirebaseSvc.auth().currentUser;
    console.log("User dang login nayyyyyyyy:   " + this.user.uid);
    console.log("email cua thang dang login neeeeeeeeeeeeeeeee    "+ this.user.email);

    const { params } = this.props.navigation.state;
    uid = params.uid;
    name = params.name;
    email = params.email;
    
    console.log("User dang login nayyyyyyyy:   " + uid);

    console.log("email cua thang trong room chat day neeeeeeeeeeeeeeeee    "+ email);
    this.chatRef=this.getRef().child("chat/"+this.generateChatId())
    this.chatRefData=this.chatRef.orderByChild("order")
    this.onSend=this.onSend.bind(this)
    this.getAvatar(res=>{this.userAvatar=res})          //lay ra avatar cua thang trong room chat
    console.log("avatarrrrrrrrrrrrrr       "+this.userAvatar)
  
  }
  generateChatId(){
    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    else return `${uid}-${this.user.uid}`;
  }
  getRef(){
    return FirebaseSvc.database().ref()
  }

  getAvatar(callback){
    
    const userRef= this.getRef().child("users")
    userRef.on("value",snap=>{
      snap.forEach(child=>{
        if(child.val().email==email)
          callback(child.val().avatar)


      })
    })

  }

  listenForItems(chatRef) {
    chatRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        items.push({
          _id: child.val().createdAt,
          text: child.val().text,
          createdAt: new Date(child.val().createdAt),
          user: {
            _id: child.val().uid,
            avatar:child.val().avatar
          },
          image:child.val().image
        });
      });
      console.log("--------------------------------------");
      console.log(items);

      this.setState({
        loading: false,
        messages: items
      });
    });
  }
  componentDidMount(){
    this.listenForItems(this.chatRefData)
  }
  componentWillUnmount(){
    this.chatRefData.off()
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend=(messages = []) =>{
    this.setState({
        messages: GiftedChat.append(this.state.messages, messages),
    });
    messages.forEach(message => {
      var now = new Date().getTime();
      this.chatRef.push({
        _id: now,
        text: message.text,
        createdAt: now,
        uid: this.user.uid,
        // user:{
        //   uid: this.user.uid,
        //   // avatar: this.user.avatar
        // },
        avatar:"https://placeimg.com/640/480/nature",
        order: -1 * now,
        image:''
      });
    });
    // console.log(this.state.messages)
  }

  sendImageToFb(message){
    var now = new Date().getTime();
    this.chatRef.push({
      _id: now,
      text: message.text,
      createdAt: now,
      uid: this.user.uid,
      // uid: this.user.uid,
      order: -1 * now,
      // messageType:message.messageType,
      image: message.image
    });
  }

  pickImage(){
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log("anh day nayyyyyyyyy     "+source.uri)

        // console.log(source)
        const message={}
        let now = new Date().getTime();
        message.createdAt=now,
        message.uid=this.user.uid,

        message._id=now
        message.text=''
        // message.user={}
        // message.user._id=this.user.uid

        // message.user.avatar='https://placeimg.com/640/480/people'
        message.order = -1*now
        message.image=source.uri
        // message.messageType='image'
        // console.log("object cua anh nayyyyyyyy          "+message.image)
        // You can also display the image using data:
        
        // this.setState({
        //   avatarSource: source,
        // });

        this.setState({
          // messages: [message, ...this.state.messages]
          messages: GiftedChat.append(this.state.messages, message),

      });
      console.log(this.state.messages)
      this.sendImageToFb(message)

      }
    });
  
  } 
  // handleAvatarPress(){
  //   this.props.navigation.nivagate('Personalize')
  // }

  render() {
    const rightButtonConfig = {
      title: 'Add photo',
      handler: () => this.pickImage(),
  };
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
            title={{ title: "chat" }}
            rightButton={rightButtonConfig}
        />
        <GiftedChat
          messages={this.state.messages}
          showUserAvatar
          isAnimated
          showAvatarForEveryMessage
          onSend={this.onSend.bind(this)}
          onPressAvatar={this.handleAvatarPress}
          user={{
            _id: this.user.uid,
            // avatar:"https://placeimg.com/640/480/nature"
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    marginRight: 10,
    marginLeft: 10
  }
});