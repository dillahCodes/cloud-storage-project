function convertToEpoch(dateString: string): number | null {
  // Menggunakan regular expression untuk memvalidasi format tanggal
  const datePattern = /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/;

  // Memeriksa apakah format string tanggal valid
  if (!datePattern.test(dateString)) {
    console.error("Format tanggal tidak valid:", dateString);
    return null; // Mengembalikan null jika format tidak valid
  }

  // Mengonversi string tanggal menjadi objek Date
  const dateObject = new Date(dateString);

  // Memeriksa apakah objek Date valid
  if (isNaN(dateObject.getTime())) {
    console.error("Tanggal tidak dapat diparsing:", dateString);
    return null; // Mengembalikan null jika parsing gagal
  }

  // Mengembalikan waktu epoch dalam milidetik
  return dateObject.getTime();
}

export default convertToEpoch;

// // Contoh penggunaan
// const dateString: string = "Wed, 23 Oct 2024 14:47:20 GMT";
// const epochTime: number | null = convertToEpoch(dateString);
// if (epochTime !== null) {
//   console.log(epochTime); // Menampilkan waktu epoch dalam milidetik
// }
