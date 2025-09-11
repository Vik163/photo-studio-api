export const getDates = () => {
  const date = new Date();
  const monthString = (date.getMonth() + 1).toString();
  const month = monthString.length === 1 ? `0${monthString}` : monthString;
  const dayAndMonth = `${date.getDate()}. ${month}`;

  return { date, dayAndMonth };
};

export const getLeftDays = (created: Date, limit: 15 | 3) => {
  const currentDate = Date.parse(new Date().toString());
  const days = Math.round(
    (currentDate - Date.parse(created.toString())) / 86400000,
  ); //86400000 - ms в дне
  const leftDays = limit - days;

  return leftDays;
};
