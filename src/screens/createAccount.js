import React from 'react';
import {Platform, 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Keyboard,
  ActivityIndicator,
  BackHandler} from 'react-native';
import firebaseSvc from '../FirebaseSvc';
import {COLOR_PINK_LIGHT,COLOR_FACEBOOK} from './color.js'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FirebaseSvc from '../FirebaseSvc'
import background from '../assets/background-image.jpg'
import {Button} from 'native-base'
export default class CreateAccount extends React.Component {
  static navigationOptions = {
    title: 'Creat account',
  };

  state = {
    name: 'Alex B',
    email: 'test3@gmail.com',
    password: 'test123',
    avatar: '',
  };

  createAccount = async (user) => {
    await FirebaseSvc.auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(function() {
        console.log("created user successfully. User email:" + user.email + " name:" + user.name);
        var userf = FirebaseSvc.auth().currentUser;
        userf.updateProfile({ displayName: user.name})
        .then(function() {
          console.log("Updated displayName successfully. name:" + user.name);
          alert("User " + user.name + " was created successfully. Please login.");
        }, function(error) {
          console.warn("Error update displayName.");
        });
      }, function(error) {
        console.error("got error:" + typeof(error) + " string:" + error.message);
        alert("Create account failed. Error: "+error.message);
      });
    console.log("write firebaseeeeeeeeeeeeeeee")
    let User=FirebaseSvc.auth().currentUser
    console.log(User.uid)

    const itemRef=FirebaseSvc.database().ref().child("users").push({
      userId:User.uid,
      email:User.email,
      name: user.name,
      avatar:user.avatar

    });
  }

  onPressCreate = async () => {
    console.log('create account... email:' + this.state.email);
    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        avatar: this.state.avatar,
      };
      await this.createAccount(user);
    } catch ({ message }) {
      console.log('create account failed. catch error:' + message);
    }
  };
  onPressUploadAvatar=async()=>{
    console.log('an dc nayyyyyyyyyyyyyyyyyyyyyyyy')
    
  }

  onChangeTextEmail = email => this.setState({ email });
  onChangeTextPassword = password => this.setState({ password });
  onChangeTextName = name => this.setState({ name });


  render() {
    return (
      <ImageBackground source={background} style={{width: '100%', height: '100%',}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.up}>
              <Ionicons 
                name="ios-contacts"
                size={100}
                color={'white'}> </Ionicons>
              <Text style={styles.title}>
                TẠO TÀI KHOẢN
              </Text>
            </View>
            <View style ={styles.down}>
                <View style ={styles.textInputContainer}>
                    <TextInput style={styles.textInput}
                    textContentType='emailAddress'
                    keyboardType='email-address'  
                    placeholder='Email'
                    onChangeText={this.onChangeTextEmail}
                    value={this.state.email}
                    >
                    </TextInput>
                </View>

                <View style ={styles.textInputContainer}>
                    <TextInput style={styles.textInput}
                    placeholder='Password' 
                    secureTextEntry={true}
                    onChangeText={this.onChangeTextPassword}
                    value={this.state.password}
                    ></TextInput>
                </View>  
                <View style ={styles.textInputContainer}>
                    <TextInput style={styles.textInput}
                    placeholder='Name' 
                    
                    onChangeText={this.onChangeTextName}
                    value={this.state.name}
                    ></TextInput>
                </View>  
                {/* <TouchableOpacity 
                style={styles.loginButton}
                onPress={this.onPressUploadAvatar}
                >
                  <Text style={styles.loginButtonTittle}>
                  Upload Avatar
                  </Text>
                </TouchableOpacity> */}
                <View style={{margin:10, width:280}}>
                  <Button full info onPress={this.onPressCreate}>
                    {/* <Icon name='signin' style = {{color:'white'}}></Icon> */}
                    <Text style = {{color:'white'}}>ĐĂNG KÝ</Text>
                  </Button>
                </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        </ImageBackground>
        
      );
    }
  }

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection : 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
  },
  up:{
      flex:3,
      flexDirection : 'column',
      justifyContent:'center',
      alignItems:'center',
      marginTop:10
  },
  down:{
      flex:7,
      flexDirection : 'column',
      
      justifyContent:'flex-start',
      alignItems:'center'
  },
  title:{
      color: 'white',
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



