import {createStackNavigator,createAppContainer,createSwitchNavigator,createBottomTabNavigator} from 'react-navigation'


// import RootStack from './RootStack'
import React from 'react';
import Login from '../screens/Login'
import Chat from '../screens/Chat'
import ListChat from '../screens/Home/ListChat'
import SettingsScreen from '../screens/Home/SettingsScreen'
import getTabBarIcon from '../screens/Home/Icon'
// import Home from '../screens/Home/Home'
import Personalize from '../screens/Personalize'
import createAccount from '../screens/createAccount'
import Edit from '../screens/Edit'
import Ionicons from 'react-native-vector-icons/Ionicons'

// const pressAvatar= createStackNavigator(
//   {
    
//     Chat: Chat,
//     Personalize:Personalize
//   },
//   {
//     initialRouteName:'Chat'
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
      "Home": { screen: ListChat },
      // "Bạn bè" : 
      "Setting": { screen: Personalize }

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
    Edit:Edit
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