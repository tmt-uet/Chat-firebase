import React, {Component} from 'react';
import {
		StyleSheet, 
        Text, 
        View,
    	Animated,
    	Dimensions
    	} from 'react-native'
import {COLOR_PINK_LIGHT,COLOR_FACEBOOK} from './color.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
export default class Splash extends Component{
	render(){
		return(
			<View style={styles.container}>
				<Ionicons 
				name="ios-finger-print"
				size={100}
				color={'white'}> </Ionicons>
			</View>
			)
	}

}
const styles =StyleSheet.create({
	container:{
		flex:1,
		flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:COLOR_PINK_LIGHT
	}
})