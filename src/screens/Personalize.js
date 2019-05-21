import React, { Component } from "react";
import { View, ImageBackground, Alert } from "react-native";
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
import styles from "./style";
import Icon from "react-native-vector-icons/FontAwesome5";
import ImagePicker from 'react-native-image-picker';
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


class Personalize extends React.PureComponent {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state ={
      loadAvatar : false,
      isHost:this.props.navigation.getParam('isHost'),
      key:''
    }
    this.user=FirebaseSvc.auth().currentUser;
    if(this.props.navigation.getParam('id') && this.props.navigation.getParam('id') == this.user.uid){
      this.state={
        uid : this.props.navigation.getParam('id'),
        isHost: true
      }
    }
    if(this.props.navigation.getParam('id') && this.props.navigation.getParam('id') != this.user.uid){
      this.state={
        uid : this.props.navigation.getParam('id'),
        isHost: false
      }
    }
    if(!this.props.navigation.getParam('id') ){
      this.state={
        uid:this.user.uid,
        isHost:true
      }
    }
    this.getSender(res=>{this.sender=res})
    console.log('userprop', this.sender)
    
  }
  async UploadAvatar(avatar){
    this.friendsRef = this.getRef().child("users");
    console.log('uid', this.friendsRef)
    await this.friendsRef.on("value", snap => {
      // get children as an array
      snap.forEach(child => {
        if (child.val().email == this.user.email)
        {
          console.log('key', child.key)
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
        // const source = { uri: response.uri };
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log("anh day nayyyyyyyyy     "+source.uri)
        this.UploadAvatar(source.uri)
    }})
  
  }
  UpdateEmail(){
    alert('')
  }
  getRef(){
    return FirebaseSvc.database().ref()
  }
  getSender(callback){
    
    const userRef= this.getRef().child("users")
    userRef.on("value",snap=>{
      snap.forEach(child=>{
        if(child.val().userId==this.state.uid)
          callback(child.val())
      })
    })

  }
  renderUserContainer = () => {
    return <View style ={styles.drawerUserContainer}>
      <Button transparent onPress={()=>this.UpdateAvatar()}>
        <Thumbnail source={{uri: this.sender.avatar}} />
        <Spinner visible={this.state.loadAvatar} />
      </Button>
        <H3 style={styles.username}>
          {this.sender.name}
        </H3>
        <Text style = {styles.small}>{this.sender.email}</Text>
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


  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
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
          <List>
            <ListItem button noBorder>
              <Left>
                <Icon
                  active
                  name='envelope'
                  style={{ color: "#777", fontSize: 26, width: 30 }}
                />
                <Text style={styles.text}>
                  {this.sender.email}
                </Text>
              </Left>
            </ListItem>
            <ListItem button noBorder>
              <Left>
                <Icon
                  active
                  name='crown'
                  style={{ color: "#777", fontSize: 26, width: 30 }}
                />
                <Text style={styles.text}>
                  {this.sender.sex}
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
                  {this.sender.age}
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
                  {this.sender.national}
                </Text>
              </Left>
            </ListItem>
          </List>
          
          <List style={{borderTopWidth: 0.5, borderTopColor: "#777777c9", marginTop: 15}}>
          {this.state.isHost ?
            <ListItem
              button
              noBorder
              onPress={()=>this.props.navigation.navigate('Edit', {user:this.sender})}
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
          </List>
        </Content>
      </Container>
    );
  }
}
export default Personalize;