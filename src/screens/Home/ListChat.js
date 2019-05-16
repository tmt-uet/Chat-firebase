import React, { Component } from "react";
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Button,
  TextInput,
  ScrollView
} from "react-native";

import { StackNavigator } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";

import FirebaseSvc from '../../FirebaseSvc'
// var name, uid, email;
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
export default class ListChat extends Component {
  state = {
    name: "",
    uid: null,
    email: "",
    avatar: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
  };
  

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loading: true
    };
    this.friendsRef = this.getRef().child("users");
    this.user=FirebaseSvc.auth().currentUser;


  }
  // generateChatId(){
  //   if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
  //   else return `${uid}-${this.user.uid}`;
  // }
  getRef() {
    return FirebaseSvc.database().ref();
  }

  listenForItems(friendsRef) {
    var user = FirebaseSvc.auth().currentUser;
    console.log('----------')
    console.log("user",user.uid)
    friendsRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        if (child.val().email != user.email)
          items.push({
            name: child.val().name,
            uid: child.val().userId,
            email: child.val().email,
            avatar: child.val().avatar
          });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items),
        loading: false
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.friendsRef);
  }


  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null
    },
  };

  renderRow = rowData => {
    return (
     
       <Content >
          <List >
            <ListItem avatar onPress={() => {
              name = rowData.name;
              email = rowData.email;
              uid = rowData.uid;
              avatar = rowData.avatar;
              this.props.navigation.navigate("Chat", {
                name: name,
                email: email,
                uid: uid,
                avatar:avatar
              });
            }}>
              <Left>
                <Thumbnail source={{ uri: rowData.avatar }} />
              </Left>
              <Body>
                <Text>{ rowData.name }</Text>
                <Text note>Tin nhắn mới nhất</Text>
              </Body>
              <Right>
                <Text note>3:30 pm</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topGroup}>
          <Text style={styles.myFriends}>My Friends</Text>
        </View>
        <ScrollView>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
          />
        </ScrollView>
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    marginRight: 10,
    marginLeft: 10
  },
  rightButton: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    padding: 0
  },
  topGroup: {
    flexDirection: "row",
    margin: 10
  },
  myFriends: {
    flex: 1,
    color: "#3A5BB1",
    // tintColor: "#fff",
    //secondaryColor: '#E9E9E9',
    //grayColor: '#A5A5A5',
    fontSize: 16,
    padding: 5
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 6,
    marginBottom: 8
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 6
  },
  profileName: {
    marginLeft: 6,
    fontSize: 16
  }
});