import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import Conversation from "../screens/Conversation";
import MyListings from '../screens/MyListings'
const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="Conversation" component={Conversation} />
    <Stack.Screen name="MyListings" component={MyListings} />
  </Stack.Navigator>
);

export default AccountNavigator;
