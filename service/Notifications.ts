import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { DeviceStorage } from "./DeviceStorage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (!permission.granted) return;
  } catch (error) {
    console.log("Error getting a token", error);
  }
};

export const scheduleNotification = async (dateString: string) => {
  try {
    const trigger = new Date(dateString);
    trigger.setHours(-12);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pushya nakshatra reminder",
        body: "Pushya nakshatra starts in 12 hours!",
      },
      trigger,
    });

    const trigger1 = new Date(dateString);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pushya nakshatra reminder",
        body: "Pushya nakshatra started!!",
      },
      trigger: trigger1,
    });
  } catch (err) {
    console.log(err);
  }
};

export const scheduleAllNotification = async (dates: string[]) => {
  const notifyState =
    (await DeviceStorage.getItem(DeviceStorage.REMINDER_STATE)) === "";
  if (notifyState) {
    await scheduleAllNotifications(dates);
  }
};

export const scheduleAllNotifications = async (dates: string[]) => {
  for (const d of dates) {
    await scheduleNotification(d);
  }
  await DeviceStorage.setItem(DeviceStorage.REMINDER_STATE, "true");
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await DeviceStorage.setItem(DeviceStorage.REMINDER_STATE, "false");
};
