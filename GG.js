//import firebaseApp from './src/FirebaseConfig'
import React ,{Component} from 'react'
import {AppRegistry, StyleSheet, Text,View,Button} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
// GoogleSignin.configure({
//     webClientId:'1096520825590-07asd0rnrqrg8hqlohpodg034j14c4d9.apps.googleusercontent.com',
//     offlineAccess: true,
// });
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAIP8Ug0OqI5Rxv29HK8hMYTWNrgG8Yvoc",
    authDomain: "chat-app-87fd5.firebaseapp.com",
    databaseURL: "https://chat-app-87fd5.firebaseio.com",
    projectId: "chat-app-87fd5",
    storageBucket: "chat-app-87fd5.appspot.com",
    messagingSenderId: "1096520825590"
  };
firebase.initializeApp(config);
export default class GG extends Component {
    constructor(props) {
        super(props);
        this.unsubscriber = null;
        this.state = {
            isAuthenticated: false,
            typedEmail: '',
            typedPassword: '',
            user: null,
        };
    }
    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((changedUser) => {
            // console.log(`changed User : ${JSON.stringify(changedUser.toJSON())}`);
            this.setState({ user: changedUser });
        });
        GoogleSignin.configure({
            webClientId:'1096520825590-0hf7dh2d3196g2j5inuc00bkjldvi1v0.apps.googleusercontent.com',
            offlineAccess: true,
        })
        // .then(() => {
        //     // you can now call currentUserAsync()
        // });
    }
    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }





    onLoginGoogle = () => {
        GoogleSignin
            .signIn()
            .then((data) => {
                // create a new firebase credential with the token
                const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
                // login with credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                console.log(`Google Login with user : ${JSON.stringify(currentUser.toJSON())}`);
            })
            .catch((error) => {
                console.log(`Login fail with error: ${error}`);
            });
    }

    render() {
        return(        
            <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this.onLoginGoogle}
                //disabled={this.state.isSigninInProgress} 
                />
        )}

}