import React, { Component } from "react";
import {
  View,

  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Button,
  TextInput,
  ScrollView,
  FlatList
} from "react-native";

import { StackNavigator } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import SearchInput, { createFilter } from 'react-native-search-filter';
import FirebaseSvc from '../../FirebaseSvc'
// var name, uid, email;
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
const KEYS_TO_FILTERS = ['name', 'email'];
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
      searchTerm: '',
      loading: true,
       data:[]
    };
    this.friendsRef = this.getRef().child("newChat");
    this.user=FirebaseSvc.auth().currentUser;
    

  }
  // generateChatId(){
  //   if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
  //   else return `${uid}-${this.user.uid}`;
  // }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  getRef() {
    return FirebaseSvc.database().ref();
  }

  async listenForItems(friendsRef) {
    var user = FirebaseSvc.auth().currentUser;
    console.log('----------')
    console.log("user",user.uid)
    await friendsRef.on("value", async snap => {
      // get children as an array
      var items = [];
      await snap.forEach(child => {
        if (child.val().uid != user.uid)
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          console.log(child.val())
          items.push({
            name: child.val().name,
            uid: child.val().friend,
            email: child.val().emailFr,
            avatar: child.val().avatar,
            text: child.val().text,
            createdAt: child.val().createdAt,
          });
      });
      
      var a = JSON.stringify(items)
      this.setState({
       
        loading: false,
        data :JSON.parse(a)
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
  getTime(time){
    var t = new Date(time)
    var hours = t.getHours()
    var minutes = t.getMinutes()
    return hours + ':'+ minutes
  }
  renderRow = rowData => {
    console.log()
    return (
       <Content >
          <List >
            <ListItem avatar onPress={() => {
              name = rowData.item.name;
              email = rowData.item.emailFr;
              uid = rowData.item.uid;
              avatar = rowData.item.avatar;
              this.props.navigation.navigate("Chat", {
                name: name,
                email: email,
                uid: uid,
                avatar:avatar
              });
            }}>
              <Left>
                <Thumbnail source={{ uri: rowData.item.avatar }} />
              </Left>
              <Body>
                <Text>{ rowData.item.name }</Text>
                <Text note>{rowData.item.text}</Text>
              </Body>
              <Right>
                <Text note>{this.getTime(rowData.item.createdAt)}</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
    );
  };

  render() {
    const {data} = this.state
     const filteredName = data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      <View >
        <Header style={{backgroundColor: '#4db8ff', width :'100%'}}>
          <SearchInput 
            onChangeText={(term) => { this.searchUpdated(term) }} 
            style={styles.searchInput}
            placeholder="Tìm bạn bè ..."
            />
        </Header>
        <ScrollView>
          <FlatList
            data={filteredName}
            renderItem={this.renderRow}
            style={{marginBottom:70}}
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
  },
  searchInput:{
    width:'100%',
    borderColor: '#4db8ff',
    borderWidth: 1,
    borderRadius: 40,
  }
});