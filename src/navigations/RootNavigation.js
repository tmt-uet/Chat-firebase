import {createStackNavigator,createAppContainer,createSwitchNavigator,createBottomTabNavigator} from 'react-navigation'


// import RootStack from './RootStack'
import React from 'react';
import Login from '../screens/Login'
import Chat from '../screens/Chat'
import ListChat from '../screens/Home/ListChat'
import SettingsScreen from '../screens/Home/SettingsScreen'
import getTabBarIcon from '../screens/Home/Icon'
import Icon from "react-native-vector-icons/FontAwesome5";
import Personalize from '../screens/Personalize'
import createAccount from '../screens/createAccount'
import Edit from '../screens/Edit'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Friend from './../screens/Friend/index'
import Friends from '../screens/Friend/Friends'
import RequestFriend from '../screens/Friend/RequestFriend';
import User from '../screens/Friend/User';
// const Person= createStackNavigator(
//   {
//     Friend: Friend,
//     Friends: Friends,
//     RequestFriend:RequestFriend,
//     User: User
//   },
//   {
//     initialRouteName:'User'
//   }
// )

// const ListChatStack= createStackNavigator(
//   {
//     ListChat: ListChat,
//     Chat: Chat,
//     Personalize:Personalize
//   },
//   {
//     initialRouteName:'ListChat'
//   }
// )
 const Home = createAppContainer(
  createBottomTabNavigator(
    {
      "Trang chủ": { 
        screen: ListChat,
        navigationOptions: {
          tabBarIcon: ({tintColor}) =>
            <Icon name="home" size={25} color={tintColor} />
            
        }
      },
      "Bạn bè" : {
        screen: Friend,
        navigationOptions: {
          tabBarIcon: ({tintColor}) =>
            <Icon name="user-friends" size={25} color={tintColor} />
        }
      },
      "Cài đặt": { 
        screen: Personalize,
        navigationOptions: {
          tabBarIcon: ({tintColor}) =>
            <Icon name="user-cog" size={25} color={tintColor} />
        }
      },

    },
    // {
    //   defaultNavigationOptions: ({ navigation }) => ({
    //     tabBarIcon: ({ focused, horizontal, tintColor }) => {
    //       const { routeName } = navigation.state;
    //       let IconComponent = Ionicons;
    //       let iconName;
    //       if (routeName === 'Home') {
    //         iconName = `ios-information-circle${focused ? '' : '-outline'}`;
    //         // Sometimes we want to add badges to some icons. 
    //         // You can check the implementation below.
    //         IconComponent = HomeIconWithBadge; 
    //       } else if (routeName === 'Settings') {
    //         iconName = `ios-options`;
    //       }
  
    //       // You can return any component that you like here!
    //       return <IconComponent name={iconName} size={25} color={tintColor} />;
    //     },
    //   }),
    //   tabBarOptions: {
    //     activeTintColor: 'tomato',
    //     inactiveTintColor: 'gray',
    //   },
    // }
  )
);


const RootStack = createSwitchNavigator(
  {
    Login: Login,
    createAccount: createAccount,
     Home : Home,
     ListChat: ListChat,
    Chat: Chat,
    Personalize:Personalize,
    Edit:Edit,
    Friend: Friend,
    // Friends: Friends,

  },
  {
    initialRouteName: 'Login',  
  }
);
// export default RootNavigation;
const AppContainer = createAppContainer(RootStack);

export default class RootNavigation extends React.Component {
  render() {
    return <AppContainer />;
  }
}
