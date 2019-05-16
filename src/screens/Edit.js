/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View,
        TextInput,
        TouchableOpacity,
        TouchableWithoutFeedback,
        Keyboard,
        ImageBackground,
        ActivityIndicator} from 'react-native';
// import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import firebase from 'firebase';
import {Input, Icon, Button} from 'native-base'
import {COLOR_PINK_LIGHT,COLOR_FACEBOOK} from './color.js'
import background from '../assets/background-image.jpg'
import FirebaseSvc from  '../FirebaseSvc'
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
export default class Edit extends Component{
    
    constructor(props) {
      super(props);
      this.user =this.props.navigation.getParam('user')
      this.state = {
        logged: false,
        animating: false,
        name: this.user.name,
        email: this.user.email,
        key:''
        }
    }
    async update(){
        var updates={
            name : this.state.name,
            email: this.state.email
        }
        
        this.friendsRef = this.getRef().child("users");
        console.log('uid', this.friendsRef)
        await this.friendsRef.on("value", snap => {
          // get children as an array
          snap.forEach(child => {
            if (child.val().email == this.state.email)
            console.log('key', child.key)
            this.setState({
              key:child.key
            })
          });
          
        }) 
        await FirebaseSvc.database().ref('users/'+this.state.key +'/').update(updates)
            .then(()=>{
                alert('Lưu thay đổi')
                this.props.navigation.navigate('Personalize')
            });
    }
    getRef() {
        return FirebaseSvc.database().ref();
    }
  onChangeTextEmail = email => this.setState({email})
//   onChangeTextPassword= password => this.setState({password})
  onChangeTextName = name => this.setState({name})
    render(){
    return (
      <ImageBackground source={background} style={{width: '100%', height: '100%',}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.up}>
                  <Ionicons 
                  name="ios-contacts"
                  size={100}
                  color={'white'}> </Ionicons>
              </View>
              <View style ={styles.down}>
                  <View style ={styles.textInputContainer}>
                    <Text>Tên</Text>
                    <TextInput style={styles.textInput}
                    placeholder='Name' 
                    
                    onChangeText={this.onChangeTextName}
                    value={this.state.name}
                    ></TextInput>
                  </View>
                  <View style ={styles.textInputContainer}>
                    <Text>Email</Text>
                      <TextInput style={styles.textInput}
                      textContentType='emailAddress'
                      keyboardType='email-address'  
                      placeholder='Email'
                      onChangeText={this.onChangeTextEmail}
                      value={this.state.email}
                      >
                        
                      </TextInput>
                  </View>
                  {/* <View style ={styles.textInputContainer}>
                    <Text>Mật khẩu</Text>
                    <TextInput style={styles.textInput}
                    placeholder='Password' 
                    secureTextEntry={true}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                    ></TextInput>
                        
                  </View> */}

                  <View style={{ margin:10, width:280}}>
                    <Button iconLeft bordered full success  onPress={()=>this.update()}>
                      <Icon name='save' size={20}></Icon>
                      <Text> LƯU Thay ĐỔI</Text>
                    </Button>
                </View>
                <Button
          onPress={() => {
            /* HERE WE GONE SHOW OUR FIRST MESSAGE */
            showMessage({
              message: "Simple message",
              type: "info",
            });
          }}
          title="Request Details"
          color="#841584"
        />
                <ActivityIndicator
                    //{console.log(this.state.logged)}
                    animating={this.state.animating}
                    
                    color="#ddd"
                    size="large"
                />

              </View>

            </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )

}


}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection : 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        // backgroundColor: COLOR_PINK_LIGHT,
    },
    up:{
        flex:3,
        flexDirection : 'column',
        justifyContent:'center',
        alignItems:'center',

    },
    down:{
        flex:7,
        flexDirection : 'column',
        
        justifyContent:'flex-start',
        alignItems:'center'
    },
    title:{
        color: 'firebrick',
        textAlign : 'center',
        width: 400,
        fontSize:25,
        marginBottom:40
    },
    textInputContainer:{
        paddingHorizontal:10,
        borderRadius:6,
        marginBottom:20, 
        backgroundColor:'rgba(255,255,255,0.2)',
    },
    textInput:{
        width:280,
        height : 45,
        borderBottomWidth:1,
        borderColor:'#00cc99',
    },
    loginButton:{
        width:300,
        height:45,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:6,
        backgroundColor:'red'


    },
    loginButtonTittle:{
        fontSize :18, 
        color:'white'
    },
    facebookButton:{
        width:300,
        height:45,
        borderRadius:6,
        justifyContent:'center',
    },
  line: {
    height: 1,
    flex: 2,
    backgroundColor: 'black'
  },
  textOR: {
    flex: 1,
    textAlign: 'center'
  },
  divider: {
    flexDirection: 'row',
    height: 40,
    width: 298,
    justifyContent: 'center',
    alignItems: 'center'
  }

});
