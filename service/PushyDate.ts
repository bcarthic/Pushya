import dates from "../dates.json";
import { DeviceStorage } from "./DeviceStorage";
import { convertDateToUserTimezone, formatTime, isPastDate } from "./TimeZone";

export interface PushyaDates {
  [year: string]: PushyaDate[];
}

export interface PushyaDate {
  start: string;
  end: string;
}

const getDates = async (): Promise<PushyaDate[]> => {
  const currentYear = new Date().getFullYear().toString();
  try {
    const getDatesFromServer = async () => {
      const response = await fetch(
        "https://poosam.azurewebsites.net/api/Pushya",
      );
      const result = await response.json();
      dates = JSON.parse(result) as PushyaDates;
      await DeviceStorage.setItem(DeviceStorage.PUSHYA_DATES, result);

      return result[currentYear];
    };

    let dates = JSON.parse(
      (await DeviceStorage.getItem(DeviceStorage.PUSHYA_DATES)) || "{}",
    ) as PushyaDates;

    if (dates && dates[currentYear]) {
      getDatesFromServer();
      return dates[currentYear];
    }

    return getDatesFromServer();
  } catch (error) {
    console.error(error);
    return dates[2021];
  }
};

export const getFilteredDates = async (): Promise<PushyaDate[]> => {
  console.log("Getting filtered date");
  const dates = await getDates();
  console.log("Filtered date", dates);
  const list: PushyaDate[] = [];
  if (dates) {
    for (const value of dates) {
      const localTime = convertDateToUserTimezone(value.end);
      if (!isPastDate(localTime)) {
        list.push({
          start: convertDateToUserTimezone(value.start),
          end: localTime,
        });
      }
    }
  }

  return list;
};
