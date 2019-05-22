import {AppRegistry, StyleSheet, Text,View} from 'react-native';
import React, {Component} from 'react'
import {name as appName} from './app.json';
import RootNavigation from './src/navigations/RootNavigation'
import test_Image from './test_Image'
import Splash from './src/screens/Splash'
import testMap from './testMap'
import Example from './Example'
class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentScreen : 'Splash'
        }
    }
    
    render(){
        setTimeout(() => {
            this.setState({
                currentScreen:'Login'
            })
        }, 3000)
        const {currentScreen} = this.state
        let mainScreen = currentScreen === 'Splash' ? <Splash/> : <RootNavigation/>
        return mainScreen
    }
    
}
AppRegistry.registerComponent(appName, () => Example);

console.disableYellowBox = true;