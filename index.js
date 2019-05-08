/**
 * @format
 */


import {AppRegistry, StyleSheet, Text,View} from 'react-native';


import {name as appName} from './app.json';

// import Login from './src/screens/Login'
//import Home from './src/screens/Home'
//import GG from './GG'
import RootNavigation from './src/navigations/RootNavigation'
//import TestFireBase from './TestFireBase'


AppRegistry.registerComponent(appName, () => RootNavigation);



