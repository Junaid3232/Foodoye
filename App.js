import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import navigationTheme from "./app/navigation/navigationTheme";
import AuthNavigator from "./app/navigation/AuthNavigator";
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCnD2hgEZoFppqFKDp2oPiN5h3bnbluQwA",
  authDomain: "foodoyee-expo.firebaseapp.com",
  databaseURL: "https://foodoyee-expo.firebaseio.com",
  projectId: "foodoyee-expo",
  storageBucket: "foodoyee-expo.appspot.com",
  messagingSenderId: "89033889170",
  appId: "1:89033889170:web:35b3722f10e33abeed9d4b",
};

firebase.initializeApp(firebaseConfig);
LogBox.ignoreAllLogs(true);
export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <AuthNavigator />
    </NavigationContainer>
  );
}
