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
import { GiftedChat } from "react-native-gifted-chat";
import ImagePicker from 'react-native-image-picker';
import propTypes from "prop-types";
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Header, Left, Right, Body, Button,Icon, Fab, Footer, FooterTab} from 'native-base'
import NavigationBar from "react-native-navbar";
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
    super(props)
    state = {
      messages: [],
      active: false
    }
    this.user=FirebaseSvc.auth().currentUser;
    console.log("User dang login nayyyyyyyy:   " + this.user.uid);
    console.log("email cua thang dang login neeeeeeeeeeeeeeeee    "+ this.user.email);

    const { params } = this.props.navigation.state;
    uid = params.uid;
    name = params.name;
    email = params.email;
    avatar = params.avatar
    
    console.log("User dang login nayyyyyyyy:   " + uid);

    console.log("email cua thang trong room chat day neeeeeeeeeeeeeeeee    "+ email);
    this.chatRef=this.getRef().child("chat/"+this.generateChatId())
    this.chatRefData=this.chatRef.orderByChild("order")
    this.getSender(res=>{this.sender=res})      //lay ra thong tin thang gui(dang dang nhap)
    // this.user=FirebaseSvc.auth().currentUser;
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
            image:child.val().image
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
            image:child.val().image
          });
        }
        
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
        avatar:this.sender.avatar,
        order: -1 * now,
        image:''
      });
      FirebaseSvc.database().ref('newChat/' + this.generateChatId() +'/').update({
        _id: now,
        text: message.text,
        createdAt: now,
        uid: this.user.uid,
        order: -1 * now,
        friend: uid,
        name: name, 
        avatar: avatar,
        emailFr : email
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
      name:name,
      text: 'Gửi hình ảnh',
      createdAt: now,
      uid: this.user.uid,
      order: -1 * now,
      friend:uid,
      avatar:avatar, 
      emailFr: email
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
    this.props.navigation.navigate('Personalize', {id : temp_user._id})
  }

  renderAudio = props => {
    return !props.currentMessage.audio ? (
        <View />
    ) : (
            <Ionicons
                name="ios-play"
                size={35}
                color={this.state.playAudio ? "red" : "blue"}
                style={{
                    left: 90,
                    position: "relative",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    backgroundColor: "transparent"
                }}
                onPress={() => {
                    this.setState({
                        playAudio: true
                    });
                    const sound = new Sound(props.currentMessage.audio, "", error => {
                        if (error) {
                            console.log("failed to load the sound", error);
                        }
                        this.setState({ playAudio: false });
                        sound.play(success => {
                            console.log(success, "success play");
                            if (!success) {
                                Alert.alert("There was an error playing this audio");
                            }
                        });
                    });
                }}
            />
        );
};
  handleAudio(){
    console.log('an dc nheseeeeeeeeeeeee')
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
          renderActions={() => {
            if (Platform.OS === "ios") {
                return (
                    <Ionicons
                        name="ios-mic"
                        size={35}
                        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                        color={this.state.startAudio ? "red" : "black"}
                        style={{
                            bottom: 50,
                            right: Dimensions.get("window").width / 2,
                            position: "absolute",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            zIndex: 2,
                            backgroundColor: "transparent"
                        }}
                        onPress={this.handleAudio}
                    />
                );
            }
        }}
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
  }
});