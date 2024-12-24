function translateEpochToDate(seconds: number): string {
  return new Date(seconds * 1000).toDateString();
}

export default translateEpochToDate;
