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
import CustomActions from '../../CustomActions';
import CustomView from '../../CustomView';
var options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var name, uid, email, avatar;         //luu thong tin cuar thang trong room chat
import FirebaseSvc from '../FirebaseSvc'

export default class Chat extends React.Component {
//   static propTypes = {
//     user: propTypes.object,
// };
  constructor(props){
    super(props);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
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
    avatar = params.avatar
    
    console.log("User chat nayyyyyyyy:   " + uid);

    console.log("email cua thang trong room chat day neeeeeeeeeeeeeeeee    "+ email);
    this.chatRef=this.getRef().child("chat/"+this.generateChatId())
    this.chatRefData=this.chatRef.orderByChild("order")
    this.getSender(res=>{this.sender=res})      //lay ra thong tin thang gui(dang dang nhap)
    // this.user=FirebaseSvc.auth().currentUser;
  }
  renderCustomActions(props) {
    if (Platform.OS === 'android') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
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
    // console.log('thuuuuuuuuuuuuuuuuuuuuuu props')
    // console.log(props)
    return (
      <CustomView
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
  generateChatId(){
    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    else return `${uid}-${this.user.uid}`;
  }
  getRef(){
    return FirebaseSvc.database().ref()
  }
  getSender(callback){
    
    const userRef= this.getRef().child("users")
    userRef.on("value",snap=>{
      snap.forEach(child=>{
        if(child.val().email==this.user.email)
          callback(child.val())


      })
    })

  }


  listenForItems(chatRef) {
    chatRef.on("value", snap => {
      // get children as an array
      var items = [];
      var text = ''
      // console.log(this.user,userId)
      snap.forEach(child => {
        if(child.val().uid == this.user.uid){
          items.push({
            _id: child.val().createdAt,
            text: child.val().text,
            createdAt: new Date(child.val().createdAt),
            user: {
              _id: child.val().uid,
              avatar: this.sender.avatar,
              name:child.val().name
            },
            image:child.val().image,
            location:child.val().location,
          });
        }else{
          items.push({
            _id: child.val().createdAt,
            text: child.val().text,
            createdAt: new Date(child.val().createdAt),
            user: {
              _id: child.val().uid,
              avatar:avatar,
              name:child.val().name
            },
            image:child.val().image,
            location:child.val().location,
          });
        }
        if(child.val().image !== ''){
          text='Nhận hình ảnh'
        }else if(child.val().location){
          text='Nhận vị trí'
        
        }else{
          text = child.val().text
        }
        var now = new Date().getTime();
        FirebaseSvc.database().ref('newChat/' + this.generateChatId() +'/').update({
          _id: now,
          text: text,
          createdAt: now,
          uid: this.user.uid,
          order: -1 * now,
          friend: uid,
          nameFr: name, 
          avatarFr: avatar,
          emailFr : email,
          email:this.sender.email,
          avatar:this.sender.avatar
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
          text: 'Welcome to chat',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: this.props.navigation.getParam('avatar'),
          },
        },
      ],
    })
  }

  onSend=(messages = []) =>{
// this.setState({
    //     messages: GiftedChat.append(this.state.messages, messages),
    // });
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(this.state.messages, messages),
      };
    });

    messages.forEach(message => {
      var temp_location={},text=''
      if(message.text.length<1){
        temp_location=message.location
      }
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
        avatar:this.sender.avatar,
        order: -1 * now,
        image:'',
        location:temp_location,
      });
      if(message.text.length<1){
        text='Nhận vị trí'
      
      }else{
        text = message.text
      }
      FirebaseSvc.database().ref('newChat/' + this.generateChatId() +'/').update({
        _id: now,
        text: text,
        createdAt: now,
        uid: this.user.uid,
        order: -1 * now,
        friend: uid,
        nameFr: name, 
        avatarFr: avatar,
        emailFr : email,
        name: this.sender.name,
        avatar : this.sender.avatar,
        email: this.sender.email
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
      order: -1 * now,
      avatar:message.avatar,
      image: message.image
    });
    FirebaseSvc.database().ref('newChat/' + this.generateChatId +'/').update({
      _id: now,
      nameFr:name,
      text: 'Gửi hình ảnh',
      createdAt: now,
      uid: this.user.uid,
      order: -1 * now,
      friend:uid,
      avatarFr:avatar, 
      emailFr: email,
      name: this.sender.name,
      email:this.sender.email,
      avatar: this.sender.avatar
    });
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

        console.log("anh day nayyyyyyyyy     "+source.uri)

        // console.log(source)
        const message={}
        let now = new Date().getTime();
        message.createdAt=now,
        message.uid=this.user.uid,

        message._id=now
        message.text=''


        message.avatar=this.sender.avatar
        message.order = -1*now
        message.image=source.uri


        this.setState({
          messages: GiftedChat.append(this.state.messages, message),

      });
      console.log(this.state.messages)
      this.sendImageToFb(message)

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

        console.log("anh day nayyyyyyyyy     "+source.uri)

        // console.log(source)
        const message={}
        let now = new Date().getTime();
        message.createdAt=now,
        message.uid=this.user.uid,

        message._id=now
        message.text=''


        message.avatar=this.sender.avatar
        message.order = -1*now
        message.image=source.uri


        this.setState({
          messages: GiftedChat.append(this.state.messages, message),

      });
      console.log(this.state.messages)
      this.sendImageToFb(message)

      }
    });
  
  }


  handleAvatarPress=(temp_user)=>{
    console.log('------------------------')                                           
    console.log('id',temp_user._id)
    this.props.navigation.navigate('Personalize', {id : temp_user._id                                                                                           })
  }


  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header style={{backgroundColor: '#4db8ff'}}>
          <Left>
            <Button transparent onPress={()=>this.props.navigation.navigate('Home')}>
              <Ionicons name='md-arrow-back' size={28} style={{color:'white'}}></Ionicons>
            </Button>
          </Left>
          <Body>
            <Text style={{fontWeight:'bold', fontSize:20, color:'white'}}>
              {this.props.navigation.getParam('name')}
            </Text>
          </Body>
        </Header>
        <GiftedChat
          messages={this.state.messages}
          showUserAvatar
          isAnimated
          showAvatarForEveryMessage
          onSend={this.onSend.bind(this)}
          onPressAvatar={this.handleAvatarPress}
          user={{
            _id: this.user.uid,
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
  container: {
    flex: 1,
    alignItems: "stretch",
    marginRight: 10,
    marginLeft: 10
  },
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