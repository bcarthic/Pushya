import * as Localization from "expo-localization";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Header,
  Image,
  ListItem,
  Overlay,
} from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { DeviceStorage } from "../service/DeviceStorage";
import {
  cancelAllNotifications,
  scheduleAllNotification,
  scheduleAllNotifications,
} from "../service/Notifications";
import { getFilteredDates, PushyaDate } from "../service/PushyDate";
import { formatTime } from "../service/TimeZone";
import Intro from "./Intro";

export interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<PushyaDate[]>([]);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const getDates = async () => {
      const dates = await getFilteredDates();
      setList(dates);
      await scheduleAllNotification(dates.map((v) => v.start));
    };

    getDates();
  }, []);

  useEffect(() => {
    const getNotificationState = async () => {
      const notifyState =
        (await DeviceStorage.getItem(DeviceStorage.REMINDER_STATE)) == "true";
      setNotifyEnabled(notifyState);
    };

    getNotificationState();
  }, []);

  useEffect(() => {
    const changeFtu = async () => {
      const ftuState = await DeviceStorage.getItem(DeviceStorage.FTU_STATE);
      if (!ftuState) {
        setVisible(true);
      }
    };

    changeFtu();
  }, []);
  const createAlert = (notifyEnabled: boolean) => {
    if (notifyEnabled) {
      return Alert.alert(
        "Turn off notifications",
        "Do you want to cancel all reminders?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await cancelAllNotifications();
              setNotifyEnabled(false);
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      return Alert.alert(
        "Turn on notifications",
        "Do you want to turn on reminders?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await scheduleAllNotifications(list.map((v) => v.start));
              setNotifyEnabled(true);
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  return (
    <View>
      <Header
        placement="left"
        containerStyle={styles.header}
        leftComponent={
          <Image
            source={require("../assets/logo512.png")}
            style={{ width: 30, height: 30 }}
          />
        }
        centerComponent={{
          text: `PUSHYA - ${Localization.timezone}`,
          style: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          },
        }}
        rightComponent={
          <Button
            buttonStyle={styles.button}
            icon={
              notifyEnabled ? (
                <Icon name="bell-off" size={15} color="white" />
              ) : (
                <Icon name="bell" size={15} color="white" />
              )
            }
            onPress={async () => {
              createAlert(notifyEnabled);
            }}
          />
        }
      />
      <ScrollView style={styles.scrollView}>
        {list.map((l, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                {`Start : ${formatTime(l.start)}`}
              </ListItem.Title>
              <ListItem.Title>{`End   : ${formatTime(l.end)}`}</ListItem.Title>
            </ListItem.Content>
            {i == 0 && <Icon name={"sunrise"} size={30} />}
          </ListItem>
        ))}
      </ScrollView>
      <ScrollView>
        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          overlayStyle={styles.introScrollView}>
          <Intro
            onKnowMore={() => {
              DeviceStorage.setItem(DeviceStorage.FTU_STATE, "1");
              toggleOverlay();
            }}
          />
        </Overlay>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  introScrollView: {
    backgroundColor: "#126180",
  },
  textHeading: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#126180",
  },
  header: {
    backgroundColor: "#126180",
  },
});

export default Home;
