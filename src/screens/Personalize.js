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
  Badge, Thumbnail, H3
} from "native-base";
//import {connect} from "react-redux";
//import firebase from "react-native-firebase";
import styles from "./style";
import Icon from "react-native-vector-icons/FontAwesome5";
//import NavigationService from "./NavigationService";
//import { loginSuccess, logoutSuccess, miniPlayerState, syncNavigationProps } from "../../redux/actions";
const drawerCover = require("../assets/wallpaper.jpg");


const datas = [
  {
    name: "Trang cá nhân",
    route: "Anatomy",
    icon: "user-circle",
    bg: "#C5F442"
  },
  {
    name: "Cài đặt",
    route: "Header",
    icon: "dharmachakra",
    bg: "#477EEA",
    types: "11"
  },

];

class Personalize extends React.PureComponent {
  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  renderUserContainer = () => {
    // if(this.props.auth.isAuthenticated) {
    //   const user = this.props.auth.user._auth._user;
    //   const email = user.email ? user.email : "Bạn chưa cập nhật địa chỉ email";
    //   const username = user.displayName ? user.displayName : email;
    //   const photoUrl = user.photoURL ? user.photoURL : "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png";
    //   return <View style={styles.drawerUserContainer}>
    //     <Thumbnail source={{uri: photoUrl}} />
    //     <H3 style={styles.username}>{username}</H3>
    //     <Text style={styles.small}>{email}</Text>
    //   </View>
    // }
    const username = "ThuongLe";
    const email = "thuongle276@gmail.com";
    const photoUrl = "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png";
    return <View style ={styles.drawerUserContainer}>
        <Thumbnail source={{uri: photoUrl}} />
        <H3 style={styles.username}>{username}</H3>
        <Text style={styles.small}>{email}</Text>
      </View>
   // return <View><Text>Empty</Text></View>
  };

  onSignout = () => {
    if(this.props.auth.isAuthenticated) {
      firebase.auth().signOut().then((res) => {
        //this.props.dispatch(logoutSuccess());
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
    }
  };

  // updateMiniPlayerState = (state) => {
  //   this.props.dispatch(miniPlayerState(state));
  // };
  //
  // componentWillReceiveProps(nextProps){
  //   // this._isMounted && this.setState({drawerState: !nextProps.navigation.state.isDrawerOpen});
  //   // this._isMounted && console.log(this.state.drawerState);
  //   this._isMounted && this.updateMiniPlayerState(!nextProps.navigation.state.isDrawerOpen);
  // }


  componentDidMount() {
    this._isMounted = true;
    // this.updateMiniPlayerState(this.state.drawerState);
    // this._isMounted && this.setState({drawerState: !this.props.navigation.state.isDrawerOpen});
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
    // this._isMounted && this.setState({drawerState: !this.props.navigation.state.isDrawerOpen});
    // console.log(this.props.auth.user);
    // this.updateMiniPlayerState();
    const u = "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png";
    return (
      <Container style={{ zIndex: 2 }}>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1, zIndex: 3 }}
        >
          {/*<Image source={drawerCover} style={styles.drawerCover} />*/}
          {/*<Image square style={styles.drawerImage} source={drawerImage} />*/}
          <ImageBackground source={drawerCover} style={styles.drawerCover}>
            {this.renderUserContainer()}
          </ImageBackground>
          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => NavigationService.navigate(data.route)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                <Right style={{ flex: 1 }}>
                  <Badge
                    style={{
                      borderRadius: 3,
                      height: 25,
                      width: 72,
                      backgroundColor: data.bg
                    }}
                  >
                    <Text
                      style={styles.badgeText}
                    >{`${data.types} Types`}</Text>
                  </Badge>
                </Right>}
              </ListItem>}
          />
          <List style={{borderTopWidth: 0.5, borderTopColor: "#777777c9", marginTop: 15}}>
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

// const mapStateToProps = state => ({
//   auth: state.user
// });

// const mapDispatchToProps = dispatch => ({
//   dispatch: dispatch
// });

export default Personalize;
