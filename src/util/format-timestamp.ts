const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const formattedTime = timeFormatter.format(date);
  const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" });

  const day = date.getDate();
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const formattedMonth = monthFormatter.format(date);
  const formattedYear = yearFormatter.format(date);

  return `${formattedTime} ${day} ${formattedMonth} ${formattedYear}`;
};

export default formatTimestamp;
