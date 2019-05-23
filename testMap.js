import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
var init={
  latitude: 21.0391661,
   longitude: 105.7848302,
   latitudeDelta: 0.015,
   longitudeDelta: 0.0121,
}
export default class testMap extends Component {
  state={
    region:init
  }
  render() {

    return (
      <View style ={styles.container}>
       <MapView
         style={styles.map}
         region={this.state.region}
       >
       </MapView>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  },
  map: {
    width: 500,
    height: 500
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0
  }
});
