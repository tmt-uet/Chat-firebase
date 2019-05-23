import React, { Component } from 'react';
import { View, Image, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Icon,Card, CardItem, Button} from 'native-base';
import SearchInput, { createFilter } from 'react-native-search-filter';
import FirebaseSvc from './../../FirebaseSvc'
import Spinner from "react-native-loading-spinner-overlay";
const KEYS_TO_FILTERS = ['name', 'email'];
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      user:[],
      loading: true
    }
    this.usersRef = this.getRef().child("users");
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }
  getRef() {
    return FirebaseSvc.database().ref();
  }
  async getUser(){
    var user = FirebaseSvc.auth().currentUser;
    // console.log('----------')
    // console.log("user",user.uid)
    await this.usersRef.on("value", async snap => {
      // get children as an array
      // console.log(snap)
      var items = [];
      await snap.forEach(child => {
        if (child.val().uid != user.uid)
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          // console.log(child.val())
          items.push({
            name: child.val().name,
            uid: child.val().userId,
            email: child.val().email,
            avatar: child.val().avatar,
          });
      });
      
      var a = JSON.stringify(items)
      this.setState({
       
        loading: false,
        user :JSON.parse(a)
      });
    });
  }
  toProfile(id){
    this.props.navigation.navigate('Personalize', {id : id})
  }
  componentDidMount(){
      this.getUser();
  }
  render() {
    const {user} = this.state
     const filteredName = user.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    return (
      <View style={styles.container}>
        <Header style={{backgroundColor: 'white', width:'100%', height:40}}>
          <SearchInput 
            onChangeText={(term) => { this.searchUpdated(term) }} 
            style={styles.searchInput}
            placeholder="Tìm kiếm ..."
            />
        </Header>
          <Container>
            <Content >
              <Card>
                <ScrollView>
                  {
                    filteredName.map((u, i)=>{
                      return(
                        <CardItem key={ i } 
                          style={{flexDirection:'row'}}
                          button
                          onPress={()=>this.toProfile(u.uid)}
                        >
                          <View style={{flex:1}}>
                            <Thumbnail source={{ uri: u.avatar }}/>
                          </View>
                          <View style={{flex:3}}>
                            <Text >{u.name}</Text>
                            <Text note> {u.email}</Text>
                          </View>
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
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 40,
  }
})