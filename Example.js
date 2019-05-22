import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  TextInput,
  Platform,
  PermissionsAndroid,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { StackNavigator } from "react-navigation";
import {GiftedChat, Actions, Bubble, SystemMessage} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-picker';
import propTypes from "prop-types";
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Header, Left, Right, Body, Button,Icon, Fab, Footer, FooterTab} from 'native-base'
import NavigationBar from "react-native-navbar";
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import FirebaseSvc from './src/FirebaseSvc'

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      typingText: null,
    };

    this.onSend = this.onSend.bind(this);
    // this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.chatRef=this.getRef().child("chat/"+'yQQOqrZ4FWcSpCpjTCF1RdScUSy2-CKLZGesjhEg5JT0HxjuYOeR5zSi1')
    this.chatRefData=this.chatRef.orderByChild("order")

  }
  getRef(){
    return FirebaseSvc.database().ref()
  }
  listenForItems(chatRef) {
    chatRef.on("value", snap => {
      // get children as an array
      var items = [];
      // console.log(this.user,userId)
      snap.forEach(child => {
        // if(child.val().uid == this.user.uid){
          items.push({
            _id: child.val().createdAt,
            text: child.val().text,
            createdAt: new Date(child.val().createdAt),
            user: {
              _id: child.val().uid,
              // avatar: this.sender.avatar,
              // name:child.val().name
            },
            location:child.val().location,
            image:child.val().image
          });
        // }else{
        //   items.push({
        //     _id: child.val().createdAt,
        //     text: child.val().text,
        //     createdAt: new Date(child.val().createdAt),
        //     user: {
        //       _id: child.val().uid,
        //       // avatar:avatar,
        //       // name:child.val().name
        //     },
        //     image:child.val().image
        //   });
        // }
        
      });
      // console.log("--------------------------------------");
      // console.log(items);

      // this.setState({
      //   loading: false,
      //   messages: items
      // });
      // this.setState((previousState) => {
      //   return {
      //     messages: GiftedChat.append(previousState.messages, items),
      //   };
      // });
      this.setState({
        // loading: false,
        messages: items
      });
      console.log('tin nhannnnnnnnnnnnn')
      console.log(this.state.messages)
    });
  }
  componentDidMount(){
    this.listenForItems(this.chatRefData)

  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Welcome to chat',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar:'',
          },
        },
      ],
    })
  }




  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(this.state.messages, messages),
      };
    });
    console.log('xem tin nhan nnnnnnnnnnnnnnnnnnnnn')
    console.log(messages)
    
    messages.forEach(message => {
      
      var temp_location={}
      if(message.text.length<1){
        temp_location=message.location
      }
      var now = new Date().getTime();
      this.chatRef.push({
        _id: now,
        text: message.text,
        createdAt: now,
        uid: 'yQQOqrZ4FWcSpCpjTCF1RdScUSy2',
        avatar:'',
        order: -1 * now,
        image:'',
        // location:message.location,
        location:temp_location
      });

    });


  }
 renderCustomActions(props) {
      return (
        <CustomActions
          {...props}
        />
      );

  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  TakePhoto=()=>{
    ImagePicker.launchCamera(options, (response) => {
      // console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // console.log("anh day nayyyyyyyyy     "+source.uri)

        // console.log(source)
      //   const message={}
      //   let now = new Date().getTime();
      //   message.createdAt=now,
      //   message.uid=this.user.uid,

      //   message._id=now
      //   message.text=''


      //   message.avatar=this.sender.avatar
      //   message.order = -1*now
      //   message.image=source.uri


      //   this.setState({
      //     messages: GiftedChat.append(this.state.messages, message),

      // });
      // // console.log(this.state.messages)
      // this.sendImageToFb(message)

      }
    });
  
  } 
  ChoosePhoto=()=>{
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // console.log("anh day nayyyyyyyyy     "+source.uri)

        // console.log(source)
      //   const message={}
      //   let now = new Date().getTime();
      //   message.createdAt=now,
      //   message.uid=this.user.uid,

      //   message._id=now
      //   message.text=''


      //   message.avatar=this.sender.avatar
      //   message.order = -1*now
      //   message.image=source.uri


      //   this.setState({
      //     messages: GiftedChat.append(this.state.messages, message),

      // });
      // // console.log(this.state.messages)
      // this.sendImageToFb(message)

      }
    });
  
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header style={{backgroundColor: '#4db8ff'}}>
          <Left>
            {/* <Button transparent onPress={()=>this.props.navigation.navigate('Home')}> */}
              <Ionicons name='md-arrow-back' size={28} style={{color:'white'}}></Ionicons>
            {/* </Button> */}
          </Left>
          <Body>
            <Text style={{fontWeight:'bold', fontSize:20, color:'white'}}>
              {/* {this.props.navigation.getParam('name')} */}
            </Text>
          </Body>
        </Header>
        <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 'yQQOqrZ4FWcSpCpjTCF1RdScUSy2', // sent messages should have same user._id
        }}

        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        renderCustomView={this.renderCustomView}

          />
        <Footer style={{height:30}}>
          <FooterTab style={{backgroundColor:'white'}}>
            <Button>
              <Icon name="camera" style={{color:"#3399ff"}} onPress={()=>this.TakePhoto()}/>
            </Button>
            <Button>
              <Icon name="image" style={{color:'#3399ff'}} onPress={()=>this.ChoosePhoto()} />
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }

}




const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});
