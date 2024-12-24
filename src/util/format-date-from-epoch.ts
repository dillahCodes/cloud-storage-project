function formatDateFromEpoch(seconds: number, nanoseconds: number) {
  const timestampInMilliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);
  const date = new Date(timestampInMilliseconds);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export default formatDateFromEpoch;
