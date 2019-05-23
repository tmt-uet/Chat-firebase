import React, { Component } from 'react';
import { View, Image, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text,Card, CardItem, } from 'native-base';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Icon from "react-native-vector-icons/FontAwesome5";
import Spinner from "react-native-loading-spinner-overlay";
const KEYS_TO_FILTERS = ['name'];
export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      friend: [],
      loading: true
    }
    this.handlePress = this.handlePress.bind(this);
    this.friendsRef = this.getRef().child("relationship");
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  getRef() {
    return FirebaseSvc.database().ref();
  }
  getFriend = async () =>{
    var user = FirebaseSvc.auth().currentUser;
    console.log('----------')
    console.log("user",user.uid)
    await this.friendsRef.on("value", async snap => {
      // get children as an array
      // console.log(snap)
      var items = [];
      await snap.forEach(child => {
        if (child.val().SendId == user.uid && child.val().State == 1){
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          // console.log(child.val())
          items.push({
            name: child.val().ResName,
            uid: child.val().ResId,
            avatar: child.val().ResAvatar,
          });
        }
        if (child.val().ResId == user.uid && child.val().State == 1){
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          // console.log(child.val())
          items.push({
            name: child.val().SendName,
            uid: child.val().SendId,
            avatar: child.val().SendAvatar,
          });
        }
      });
      
      var a = JSON.stringify(items)
      this.setState({
       
        loading: false,
        friend :JSON.parse(a)
      });
    });
  }
  handlePress=(friendId)=>{
    console.log('------------------------')
    console.log('id',friendId)
    this.props.navigation.navigate('Personalize', {id : friendId, relationship:'friend'})
  }
  async componentDidMount(){
    await this.getFriend()
  }
  render() {
    const {friend} = this.state
     const filteredName = friend.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    return (
      <View style={styles.container}>
        <Header style={{backgroundColor: 'white', width:'100%',  height:40}}>
            <SearchInput 
              onChangeText={(term) => { this.searchUpdated(term) }} 
              style={styles.searchInput}
              placeholder="Tìm bạn bè ..."
              />
        </Header>
          <Container>
            
            <Content >
              <Card>
                <ScrollView>
                  {
                    filteredName.map((u, i)=>{
                      return(
                        <CardItem key={i} button onPress={() => this.handlePress(u.uid)}>
                          <Thumbnail source={{ uri: u.avatar }} />
                          <Text style={{left:10}}>{u.name}</Text>
                          <Right>
                            <Icon active name='check-circle' size={25} style={{color:'green'}}></Icon>
                          </Right>
                        </CardItem>
                    )
                  })
                }
                
                </ScrollView>
                <Spinner visible={this.state.loading} />
            </Card>
          </Content>
        </Container>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flexDirection:'column',
    justifyContent: 'center',
    flex:1,
    width: '100%'
  },
  searchInput:{
    width:'100%',
  }
})