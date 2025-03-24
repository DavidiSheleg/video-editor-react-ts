export const modifyTimeToString = (time: number) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  let result = `${minutes}:${seconds}`;
  if (hours !== "00") {
    result = `${hours}:${result}`;
  }

  return result;
};
