const translateEpochToDate = (epochSeconds: number): string => {
  const date = new Date(epochSeconds * 1000);
  return date.toDateString();
};

export default translateEpochToDate;
