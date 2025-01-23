/**
 * Convert bytes to a human-readable format (KB, MB, GB, etc.)
 * @param bytes - The size in bytes to convert.
 * @param decimals - The number of decimals to include (default is 2).
 * @returns A string representing the size in a human-readable format.
 */
const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 MB";

  const BYTE_UNITS = [
    "Bytes", // 1 Byte
    "KB", // Kilobyte
    "MB", // Megabyte
    "GB", // Gigabyte
    "TB", // Terabyte
    "PB", // Petabyte
    "EB", // Exabyte
    "ZB", // Zettabyte
    "YB", // Yottabyte
  ];

  const BASE = 1024; // 1 KB = 1024 Bytes
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(BASE));

  // Limit decimals to the specified precision
  const valueInUnit = bytes / Math.pow(BASE, unitIndex);
  const formattedValue = valueInUnit.toFixed(decimals);

  return `${formattedValue} ${BYTE_UNITS[unitIndex]}`;
};

export default formatBytes;
