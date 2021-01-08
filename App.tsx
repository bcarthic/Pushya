import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Home from "./components/Home";
import { registerForPushNotifications } from "./service/Notifications";

const App = () => {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  return (
    <>
      <View style={styles.scrollView}>
        <Home />
        <StatusBar style="auto" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
});

export default App;
