import React, { Component } from 'react';
import { Container, Content, Tabs, Tab, TabHeading, Text , Header, ScrollableTab} from 'native-base';
import { View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import User from './User'
import Friends from './Friends'
import RequestFriend from './RequestFriend'
export default class Friend extends Component {
  constructor(props) {
      super(props);
      this.state = {     
      }
    }
  render() {
    return (
      <Tabs tabBarBackgroundColor={'#ffffff'}>
        <Tab heading={ <TabHeading><Icon name="user-friends" size={23} style={{color:'white'}}/></TabHeading>}>
          <Friends navigation = {this.props.navigation}/>
        </Tab>
        <Tab   heading={ <TabHeading  style={{ backgroundColor: "#white", color: 'black' }}>
          <Icon size={23} style={{color:'white'}} name='bell'></Icon>
          </TabHeading>}>
          <RequestFriend navigation = {this.props.navigation}/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        </Tab>
        <Tab heading={ <TabHeading><Icon name='users' size={23} style={{color:'white'}}></Icon></TabHeading>}>
            <User navigation = {this.props.navigation}/>
        </Tab>
      </Tabs>
            // </Header>
            
        
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