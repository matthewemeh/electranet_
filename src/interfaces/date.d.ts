interface MonthDetail {
  name: MonthLongName;
  shortName: MonthShortName;
}

interface DayDetail {
  name: DayLongName;
  shortName: DayShortName;
}

interface DateProps {
  year: number;
  month: number;
  hour12: number;
  hour24: number;
  minutes: number;
  seconds: number;
  dayOfWeek: number;
  monthDate: number;
  milliseconds: number;
  am_or_pm: 'am' | 'pm';
  longDayOfWeek: DayLongName;
  shortDayOfWeek: DayShortName;
  longMonthName: MonthLongName;
  shortMonthName: MonthShortName;
  millisecondsFromInception: number;
}
