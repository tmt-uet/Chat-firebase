import React, { Component } from "react";
import { View, ImageBackground, Alert , ToastAndroid} from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Container,
  Left,
  Right,
  Badge, Thumbnail, H3,Button
} from "native-base";
//import {connect} from "react-redux";
//import firebase from "react-native-firebase";
import styles from "./style";
import Icon from "react-native-vector-icons/FontAwesome5";
import ImagePicker from 'react-native-image-picker';
//import NavigationService from "./NavigationService";
//import { loginSuccess, logoutSuccess, miniPlayerState, syncNavigationProps } from "../../redux/actions";
const drawerCover = require("../assets/wallpaper.jpg");
import FirebaseSvc from '../FirebaseSvc'
import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { exportDefaultSpecifier } from "@babel/types";

var options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
const Toast = (props) => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
    return null;
  }
  return null;
};

var host={isHost:false, uid:'', relationship:''};
class Personalize extends React.PureComponent {
  state ={
    loadAvatar : false,
    key:'',
    sender: {},
    loading:true,
    nameHost : '',
    avatarHost:'',
    user:{},
    visibleDelete: false,
    visibleSend: false,
  }
  constructor(props) {
    super(props);
    this._isMounted = false;

    // console.log('userprop', sender)
    this.user=FirebaseSvc.auth().currentUser;
    this.getHost();
    if(this.state.sender.email!=''){
      this.state.loading=false
    }  
  }
  getHost(){
    if(this.props.navigation.getParam('id') 
      && this.props.navigation.getParam('id') == this.user.uid
    ){
      host.uid = this.props.navigation.getParam('id')
      host.isHost= true
    }

    if(this.props.navigation.getParam('id') 
      && this.props.navigation.getParam('id') != this.user.uid
      ){
        host.uid = this.props.navigation.getParam('id'),
        host.isHost= false
    }
    if(!this.props.navigation.getParam('id') ){
        host.uid=this.user.uid,
        host.isHost=true
    }
  }
  getRelationship(){
    console.log('hhhhhhhhhhhhhhhhhh')
    if(host.isHost == false){
      if(this.props.navigation.getParam('relationship') ){
        host.relationship = this.props.navigation.getParam('relationship')
        
      }else{
        let count = 0;
        const relationshipRef= this.getRef().child("relationship")
        relationshipRef.on("value",snap=>{
          snap.forEach(child=>{
            if(child.val().SendId==host.uid 
              && child.val().ResId == this.user.uid
              && child.val().State == 0){    
                count = count + 1;
                host.relationship = 'isInvited'
                return;
            }else if(child.val().ResId==host.uid 
              && child.val().SendId == this.user.uid
              && child.val().State == 0){
                count = count + 1;
                host.relationship = 'invited'
                return;
            }else if( child.val().ResId==host.uid 
              && child.val().SendId == this.user.uid
              && child.val().State == 1){
                count = count + 1;
                host.relationship='friend'
                return;
            }else if( child.val().SendId==host.uid 
              && child.val().ResId == this.user.uid
              && child.val().State == 1){
                count = count + 1;
                host.relationship='friend'
                return;
            }   
          })
          if(count == 0) {
            host.relationship = 'notRelationship'
          }
        })
      }
    }else{
      host.relationship = 'host'
    }
  }
  getRef(){
    return FirebaseSvc.database().ref()
  }
  getSender(callback){
    
    const userRef= this.getRef().child("users")
    userRef.on("value",snap=>{
      snap.forEach(child=>{
        if(child.val().userId==host.uid){    

          callback(child.val())
        }
      })
    })
  }
  getUser(callback){
    const userRef= this.getRef().child("users")
    userRef.on("value",snap=>{
      snap.forEach(child=>{
        if(child.val().userId==this.user.uid){    
          callback(child.val())
        }
      })
    })
  }
  async UploadAvatar(avatar){
    this.friendsRef = this.getRef().child("users");
    // console.log('uid', this.friendsRef)
    await this.friendsRef.on("value", snap => {
      // get children as an array
      snap.forEach(child => {
        if (child.val().email == this.user.email)
        {
          // console.log('key', child.key)
        this.setState({
          key:child.key
        })
      }
      });
      
    }) 
    var updates={avatar : avatar}
    await FirebaseSvc.database().ref('users/'+this.state.key +'/').update(updates)
      .then(()=>{
        this.setState({
          loadAvatar:false
        })
      });
  }
  async UpdateAvatar(){
    this.setState({
      loadAvatar:true
    })
    await ImagePicker.launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.UploadAvatar(source.uri)
    }})
  
  }
  UpdateEmail(){
    alert('')
  }
  
  renderUserContainer = () => {
    let {sender} = this.state;
    return <View style ={styles.drawerUserContainer}>
      <Button transparent onPress={()=>this.UpdateAvatar()}>
        <Thumbnail source={{uri: sender.avatar}} />
        {/* <Spinner visible={this.state.loadAvatar} /> */}
      </Button>
        <H3 style={styles.username}>
          {sender.name}
        </H3>
        <Text style = {styles.small}>{sender.email}</Text>
      </View>
  };

  onSignout = () => {
      FirebaseSvc.auth().signOut().then((res) => {
        this.props.navigation.navigate("Login");
      }).catch(function(error) {
        // An error happened.
        Alert.alert(
          "Error",
          error.message,
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: true }
        );
      });
    // }
  };
  deleteR(key){
    console.log(key)
    FirebaseSvc.database().ref('relationship/'+key +'/').remove()
    host.relationship = 'notRelationship'
    this.setState(
      {
        visibleDelete: true,
      },
      () => {
        this.hideToastDelete();
      },
    );
  }
  deleteRequest (){
    if(host.uid < this.user.uid){
      var key = this.user.uid + '-' + host.uid
    }
    else{
      var key =  host.uid+ '-' + this.user.uid 
    }
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn hủy?',
      [
        {text: 'Hủy', onPress: () => console.log('Hủy thành công')},
        {text: 'OK', onPress: () => this.deleteR(key)},
      ]
    );
  }

  acceptRequest(){
    if(host.uid < this.user.uid){
      var key = this.user.uid + '-' + host.uid
    }
    else{
      var key =  host.uid+ '-' + this.user.uid 
    }
    console.log(key)
    FirebaseSvc.database().ref('relationship/'+key +'/').update({State:1})
    host.relationship = 'friend'
  }
  sendRequest(){

    if(host.uid < this.user.uid){
      var key = this.user.uid + '-' + host.uid
    }
    else{
      var key =  host.uid+ '-' + this.user.uid 
    }
    console.log(key)
    FirebaseSvc.database().ref('relationship/'+key +'/').update(
      {
        ResId: host.uid,
        SendId: this.user.uid,
        ResName: this.state.sender.name,
        SendName: this.state.user.name,
        ResAvatar:this.state.sender.avatar,
        SendAvatar:this.state.user.avatar,
        State:0
      }
    )
    host.relationship = 'invited'
    this.setState(
      {
        visibleSend: true,
      },
      () => {
        this.hideToastSend();
      },
    );
  }
  chat(){
    this.props.navigation.navigate("Chat", {
      name: this.state.sender.name,
      email: this.state.sender.email,
      uid: host.uid,
      avatar:this.state.sender.avatar
    });
  }
  hideToastDelete = () => {
    this.setState({
      visibleDelete: false,
    });
  };
  hideToastSend = () => {
    this.setState({
      visibleSend: false,
    });
  };
  componentDidMount = async()=> {
    this._isMounted = true;

    await this.getRelationship()
    this.getSender((res) => this.setState({sender: res}))
    
      this.getUser((res) => this.setState({user: res}))
    if(this.state.sender.email!=''){
      this.state.loading=false
    }  
    
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
   let {sender} = this.state
   console.log('ban ban ban ban ban', host.relationship)
    return (
      <Container style={{ zIndex: 2 }}>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1, zIndex: 3 }}
        >
          <ImageBackground source={drawerCover} style={styles.drawerCover}>
            <Button transparent onPress={()=>this.props.navigation.navigate('Home')}>
              <Ionicons name='md-arrow-back' size={28} style={{color:'white', marginLeft:10}}></Ionicons>
            </Button>
            {this.renderUserContainer()}
          </ImageBackground>
          <View>
            {host.relationship == 'friend' ?
              <View style={{justifyContent:'center',
                 alignItems:'center',
                 width:'100%'
                 }}>
                <Text>Các bạn hiện đang là bạn bè của nhau. </Text>
                <Text>Bạn có muốn hủy kết bạn?</Text>
                <View style={{flex:1, flexDirection:'row'}}>
                  <Button rounded small info 
                    style={{alignSelf: 'center', flex:1, margin:15}} 
                    onPress={()=>this.chat()}>
                    <Text>Nhắn tin</Text>
                  </Button>
                  <Button rounded small light 
                    style={{alignSelf: 'center', flex:1, margin:15}} 
                    onPress={()=>this.deleteRequest()}>
                    <Text>Hủy kết bạn</Text>
                  </Button>
                </View>
                
              </View>
              :null
            }
            {
              host.relationship == 'isInvited'?
              <View style={{justifyContent:'center',
                 alignItems:'center',
                 width:'100%'
                 }}>
                <Text>Bạn có muốn chấp nhận lời mời kết bạn?</Text>
                <Button rounded small success onPress={this.acceptRequest()}><Text>Đồng ý</Text></Button>
                <Button rounded small light style={{alignSelf: 'center'}} onPress={()=>this.deleteRequest()}>
                  <Text>Từ chối</Text>
                </Button>
              </View>
              :null
            }
            {
              host.relationship == 'invited'?
              <View style={{justifyContent:'center',
                 alignItems:'center',
                 width:'100%'
                 }}>
                <Text>Bạn có muốn hủy lời mời kết bạn?</Text>
                <Toast visible={this.state.visibleDelete} message="Hủy lời mời thành công" />
                <Button rounded small light style={{alignSelf: 'center'}} onPress={()=>this.deleteRequest()}>
                  <Text>Hủy lời mời kết bạn</Text>
                </Button>
              </View>
              :null
            }
            {
              host.relationship == 'notRelationship'?
              <View style={{justifyContent:'center',
                 alignItems:'center',
                 width:'100%'
                 }}>
                <Text>Bạn có muốn kết bạn?</Text>
                <Toast visible={this.state.visibleSend} message="Gửi lời mời thành công" />
                <Button rounded small light style={{alignSelf: 'center'}} onPress={()=>this.sendRequest()}>
                  <Text>Gửi lời mời kết bạn</Text>
                </Button>
              </View>
              :null
            }
          </View>
          <List>
            <ListItem button noBorder>
              <Left>
                <Icon
                  active
                  name='envelope'
                  style={{ color: "#777", fontSize: 26, width: 30 }}
                />
                <Text style={styles.text}>
                  {sender.email}
                </Text>
              </Left>
            </ListItem>
            <ListItem button noBorder>
              <Left>
                <Icon
                  active
                  name='mars-stroke'
                  style={{ color: "#777", fontSize: 26, width: 30 }}
                />
                <Text style={styles.text}>
                  {sender.sex}
                </Text>
              </Left>
            </ListItem>
            <ListItem button noBorder>
              <Left>
                <Icon
                  active
                  name='child'
                  style={{ color: "#777", fontSize: 26, width: 30 }}
                />
                <Text style={styles.text}>
                  {sender.age}
                </Text>
              </Left>
            </ListItem>
            <ListItem button noBorder>
              <Left>
                <Icon
                  active
                  name='globe-americas'
                  style={{ color: "#777", fontSize: 26, width: 30 }}
                />
                <Text style={styles.text}>
                  {sender.national}
                </Text>
              </Left>
            </ListItem>
          </List>
          
          <List style={{borderTopWidth: 0.5, borderTopColor: "#777777c9", marginTop: 15}}>
          {host.isHost ?
            <ListItem
              button
              noBorder
              onPress={()=>this.props.navigation.navigate('Edit', {user:sender})}
            >
              <Left>
                <Icon
                  active
                  name="edit"
                  style={{ color: "#777", fontSize: 26, width: 30 }}
                />
                <Text style={styles.text}>
                  Chỉnh sửa
                </Text>
              </Left>
            </ListItem>
            :null
          }
          {host.isHost ? 
            <ListItem
            button
            noBorder
            onPress={this.onSignout}
          >
            <Left>
              <Icon
                active
                name="sign-out-alt"
                style={{ color: "#777", fontSize: 26, width: 30 }}
              />
              <Text style={styles.text}>
                Đăng xuất
              </Text>
            </Left>

          </ListItem>  
          : null
         }
            
          </List>
          {/* <Spinner visible={this.state.loading} /> */}
        </Content>
      </Container>
    );
  }
}


export default Personalize;