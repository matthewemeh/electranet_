/**
 * Returns an object containing shortName and name of a month.
 * @param index A integer from 0 to 11.
 */
export const getMonthDetails = (index: number): MonthDetail => {
    const monthDetails: { [key: number]: MonthDetail } = {
        0: { name: "January", shortName: "Jan" },
        1: { name: "February", shortName: "Feb" },
        2: { name: "March", shortName: "Mar" },
        3: { name: "April", shortName: "Apr" },
        4: { name: "May", shortName: "May" },
        5: { name: "June", shortName: "Jun" },
        6: { name: "July", shortName: "Jul" },
        7: { name: "August", shortName: "Aug" },
        8: { name: "September", shortName: "Sep" },
        9: { name: "October", shortName: "Oct" },
        10: { name: "November", shortName: "Nov" },
        11: { name: "December", shortName: "Dec" }
    };

    return monthDetails[index];
};

/**
 * Returns an object containing shortName and name of the day of the week.
 * @param index A integer from 0 to 6.
 */
export const getDayDetails = (index: number): DayDetail => {
    const dayDetails: { [key: number]: DayDetail } = {
        0: { name: "Sunday", shortName: "Sun" },
        1: { name: "Monday", shortName: "Mon" },
        2: { name: "Tuesday", shortName: "Tue" },
        3: { name: "Wednesday", shortName: "Wed" },
        4: { name: "Thursday", shortName: "Thu" },
        5: { name: "Friday", shortName: "Fri" },
        6: { name: "Saturday", shortName: "Sat" }
    };

    return dayDetails[index];
};

export const getDateProps = (date?: string | Date): DateProps => {
    const dateObject: Date = date ? new Date(date) : new Date();

    const dayIndex: number = dateObject.getDay();
    const year: number = dateObject.getFullYear();
    const monthDate: number = dateObject.getDate();
    const minutes: number = dateObject.getMinutes();
    const seconds: number = dateObject.getSeconds();
    const monthIndex: number = dateObject.getMonth();
    const milliseconds: number = dateObject.getMilliseconds();
    const millisecondsFromInception: number = dateObject.getTime();

    const hour24: number = dateObject.getHours();
    const hour12: number = hour24 < 12 ? hour24 : hour24 - 12;
    const am_or_pm: "am" | "pm" = hour24 < 12 ? "am" : "pm";

    const { name: longMonthName, shortName: shortMonthName }: MonthDetail =
        getMonthDetails(monthIndex);

    const { name: longDayOfWeek, shortName: shortDayOfWeek }: DayDetail = getDayDetails(dayIndex);

    return {
        year,
        hour12,
        hour24,
        minutes,
        seconds,
        am_or_pm,
        monthDate,
        milliseconds,
        longMonthName,
        longDayOfWeek,
        shortDayOfWeek,
        shortMonthName,
        month: monthIndex + 1,
        dayOfWeek: dayIndex + 1,
        millisecondsFromInception
    };
};
