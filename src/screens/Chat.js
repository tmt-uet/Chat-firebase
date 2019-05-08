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


var name, uid, email;
import FirebaseSvc from '../FirebaseSvc'

export default class Chat extends React.Component {
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
    this.userAvatar=this.getAvatar(email)
    console.log("avatarrrrrrrrrrrrrr       "+this.userAvatar)
  
  }
  generateChatId(){
    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    else return `${uid}-${this.user.uid}`;
  }
  getRef(){
    return FirebaseSvc.database().ref()
  }

  getAvatar=async(email)=>{
    
    const userRef= await this.getRef().child("users")
    userRef.on("value",snap=>{
      snap.forEach(child=>{
        if(child.val().email==email)
          console.log("ahihihihihihih"+ child.val().avatar)
          return child.val().avatar


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
            avatar:'https://placeimg.com/140/140/any',
          }
        });
      });

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

  onSend(messages = []) {
    // this.setState({
    //     messages: GiftedChat.append(this.state.messages, messages),
    // });
    messages.forEach(message => {
      var now = new Date().getTime();
      this.chatRef.push({
        _id: now,
        text: message.text,
        createdAt: now,
        user:{
          uid: this.user.uid,
          avatar:'https://placeimg.com/640/480/people',
        },

        order: -1 * now
      });
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.user.uid
        }}
      />
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