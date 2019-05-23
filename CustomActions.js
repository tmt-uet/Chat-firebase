import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';
import Icon from "react-native-vector-icons/FontAwesome5";

export default class CustomActions extends React.Component {
  constructor(props) {
    super(props);
    this._images = [];
    this.state = {
      modalVisible: false,
    };
    this.onActionsPress = this.onActionsPress.bind(this);
  }



  // onActionsPress() {
  //   this.props.onSend({
  //     text:'',
  //     location: {
  //       // latitude: position.coords.latitude,
  //       // longitude: position.coords.longitude,
  //       latitude: 21.0391661,
  //       longitude: 105.7848302,
  //     },
  //     image:'',
  //   });
  // }
  onActionsPress() {
    // navigator.geolocation.getCurrentPosition(
    //    (position) => {
    //      console.log("wokeeey");
    //      console.log(position);
         this.props.onSend({
          text:'',
          location: {
            // latitude: position.coords.latitude,
            // longitude: position.coords.longitude,
            latitude: 21.0385162,
            longitude: 105.7819986,
          },
          image:'',
         });
      //  },
    //    (error) => this.setState({ error: error.message }),
    //    { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    //  );
   }


  renderNavBar() {
    return (
      <NavBar style={{
        statusBar: {
          backgroundColor: '#FFF',
        },
        navBar: {
          backgroundColor: '#FFF',
        },
      }}>
        <NavButton onPress={() => {
          this.setModalVisible(false);
        }}>
          <NavButtonText style={{
            color: '#000',
          }}>
            {'Cancel'}
          </NavButtonText>
        </NavButton>
        <NavTitle style={{
          color: '#000',
        }}>
          {'Camera Roll'}
        </NavTitle>
        <NavButton onPress={() => {
          this.setModalVisible(false);

          const images = this.getImages().map((image) => {
            return {
              image: image.uri,
            };
          });
          this.props.onSend(images);
          this.setImages([]);
        }}>
          <NavButtonText style={{
            color: '#000',
          }}>
            {'Send'}
          </NavButtonText>
        </NavButton>
      </NavBar>
    );
  }

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <View>
        <Icon name='map-marker-alt' size={28} style={{color:'#3399ff'}}/>
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.onActionsPress}
      >
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          {this.renderNavBar()}
        </Modal>
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  icon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};