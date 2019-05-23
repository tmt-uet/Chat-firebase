import React, { Component } from 'react';
import { View, Image, StyleSheet, ImageBackground, ScrollView , Alert} from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail,Separator, Text,Card, CardItem, Button} from 'native-base';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Icon from "react-native-vector-icons/FontAwesome5";
import Spinner from "react-native-loading-spinner-overlay";
import FirebaseSvc from '../../FirebaseSvc'
const KEYS_TO_FILTERS = ['name'];
export default class RequestFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestFriend: [],
      sendRequestFriend:[],
      loading: true
    }
    this.friendsRef = this.getRef().child("relationship");
  }
  getRef() {
    return FirebaseSvc.database().ref();
  }
  getRequestFriend = async () =>{
    var user = FirebaseSvc.auth().currentUser;
    console.log('----------')
    console.log("user",user.uid)
    await this.friendsRef.on("value", async snap => {
      // get children as an array
      // console.log(snap)
      var items1 = [];
      var items2 = []
      await snap.forEach(child => {
        if (child.val().SendId == user.uid && child.val().State == 0){
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          // console.log(child.val())
          items1.push({
            key: child.key,
            name: child.val().ResName,
            uid: child.val().ResId,
            avatar: child.val().ResAvatar,
          });
        }
        
        if (child.val().ResId == user.uid && child.val().State == 0){
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
          // console.log(child.val())
          items2.push({
            key: child.key,
            name: child.val().SendName,
            uid: child.val().SendId,
            avatar: child.val().SendAvatar,
          });
        }
      });
      
      var a = JSON.stringify(items1)
      var b = JSON.stringify(items2)
      this.setState({
       
        loading: false,
        requestFriend :JSON.parse(b),
        sendRequestFriend :JSON.parse(a)
      });
    });
  }

  deleteRequestSend (key){
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn hủy?',
      [
        {text: 'Hủy', onPress: () => console.log('Hủy thành công')},
        {text: 'OK', onPress: () => FirebaseSvc.database().ref('relationship/'+key +'/').remove()},
      ]
    );
  }
  confirmRequest(key){
    FirebaseSvc.database().ref('relationship/'+key +'/').update({State:1})
  }
  deleteRequest (key){
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn hủy?',
      [
        {text: 'Hủy', onPress: () => console.log('Hủy thành công')},
        {text: 'OK', onPress: () => FirebaseSvc.database().ref('relationship/'+key +'/').remove()},
      ]
    );
  }
  handlePressRequest=(Id)=>{
  
    this.props.navigation.navigate('Personalize', {id : Id, relationship:'isInvited'})
  }
  handlePressSendRequest=(Id)=>{
   
    this.props.navigation.navigate('Personalize', {id : Id, relationship:'invited'})
  }
  async componentDidMount(){
    await this.getRequestFriend()
  }

  render() {
    const {requestFriend, sendRequestFriend}= this.state
    return (
      <View style={styles.container}>
        <Container>
          <ScrollView>
            <Content >
              <Separator bordered>
                <Text>DANH SÁCH LỜI MỜI KẾT BẠN</Text>
              </Separator>
              {
                requestFriend.map((u, i)=>{
                  return(
                  
                  <ListItem avatar  key={i}  button onPress={() => this.handlePressRequest(u.uid)}>
                    <Left>
                      <Thumbnail source={{ uri: u.avatar }} />
                    </Left>
                    <Body>
                      <Text >{u.name}</Text>
                      <Button rounded success small onPress={()=>this.confirmRequest(u.key)}>
                          <Text>Đồng ý</Text>
                      </Button>
                    </Body>        
                    <Right >
                      <Button transparent onPress={()=>this.deleteRequest(u.key)}>
                          <Icon name='trash-alt' size={23} style={{color:'gray'}}></Icon>
                        </Button>
                      {/* <Icon active nam  e='video-camera'></Icon> */}
                    </Right>
                  </ListItem>   
              
                )
              })
            }
            </Content>
            <Content >
              <Separator bordered>
                <Text>DANH SÁCH BẠN ĐÃ GỬI YÊU CẦU KẾT BẠN</Text>
              </Separator>
              {
                sendRequestFriend.map((u, i)=>{
                  return(
                  
                    <ListItem avatar  key={ i}  button onPress={() => this.handlePressSendRequest(u.uid)}>
                      <Left>
                        <Thumbnail source={{ uri: u.avatar }} />
                      </Left>
                      <Body>
                        <Text >{u.name}</Text>
                        <Text note>Muốn kết bạn</Text>
                      </Body>        
                      <Right >
                          <Button rounded small onPress={()=>this.deleteRequestSend(u.key)}>
                            <Text>Hủy</Text>
                          </Button>
                        {/* <Icon active nam  e='video-camera'></Icon> */}
                      </Right>
                    </ListItem>
                )
              })
            }
            </Content>
          </ScrollView>
          <Spinner visible={this.state.loading} />
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
    margin:8,
    width:'90%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 40,
  }
})