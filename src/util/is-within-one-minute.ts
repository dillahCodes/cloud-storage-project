const isWithinOneMinute = (time1: number, time2: number): boolean => {
  const nanoToSeconds = 1e9; // 1 second = 1e9 nanoseconds
  const time1InSeconds = time1 / nanoToSeconds;
  const time2InSeconds = time2 / nanoToSeconds;

  // Calculate the absolute difference
  const differenceInSeconds = Math.abs(time1InSeconds - time2InSeconds);

  // Check if the difference is within 1 minute
  return differenceInSeconds <= 60;
};

export default isWithinOneMinute;
