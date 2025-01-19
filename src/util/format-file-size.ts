function formatFileSize(fileSizeInBytes: number) {
  if (fileSizeInBytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(fileSizeInBytes) / Math.log(1024));
  const formattedSize = (fileSizeInBytes / Math.pow(1024, i)).toFixed(2);

  return `${formattedSize} ${units[i]}`;
}

export default formatFileSize;
