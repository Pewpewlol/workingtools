import * as fs from "fs";

console.log("Dateien vor dem Umbenennen:");

// Regex für das Datum
const regex = /\b(\d{2})\.(\d{4})\b/;
const dir = "./LNW/";
let newFileName = "3001521347" + "_Nijjar_Sandip_"+ "ORT" + "_2025-01_"+"STUNDEN";

// Seid Januar 2025
var neueBezeichnung = "300012358_Mustermann_Marianne_RZ_2025-01_167,00";

fs.readdirSync("./LNW").forEach((file) => {
  console.log(file);
  if (file.startsWith("Leistungsnachweis")) {
    let dateFileName = "";
    let dateMatchFileName = file.match(regex);

    console.log("Datei gefunden: " + file);
    if (dateMatchFileName) {
      dateFileName = dateMatchFileName[0].replace(".", "_");
    }
    newFileName = newFileName + dateFileName + ".pdf";
    console.log("newFileName: " + newFileName);
    fs.rename(dir + file, dir + newFileName, (err) => {
      if (err) throw err;

      console.log("Datei umbenannt! newFileName: " + newFileName);
    });
  }
});
