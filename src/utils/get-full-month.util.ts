export const getFullMonthName = (mon: string): string => {
  const fullMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const showtMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const i = showtMonths.findIndex(
    (s) => s.toLocaleLowerCase() === mon.toLocaleLowerCase()
  );
  return fullMonths[i];
};
