import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";
import { StackActions } from '@react-navigation/native';
import Button from "../components/Button";
import routes from "../navigation/routes";

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={1}
      style={styles.background}
      source={require("../assets/background.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo-red.png")} />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Login"
          onPress={() => {
            navigation.dispatch(
              StackActions.replace(routes.LOGIN)
            );
           }}
        />
        <Button
          title="Register"
          color="secondary"
          onPress={() => {
            navigation.dispatch(
              StackActions.replace(routes.REGISTER)
            );
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 200,
    height: 150,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagline: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 20,
  },
});

export default WelcomeScreen;
