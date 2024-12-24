const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const formattedTime = timeFormatter.format(date);

  const day = date.getDate();
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const formattedMonth = monthFormatter.format(date);

  return `${formattedTime} ${day} ${formattedMonth}`;
};

export default formatTimestamp;
