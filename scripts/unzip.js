import fs from "fs";
import unzipper from "unzipper";

export function unZipFile(file, outputDir) {
  const extractStream = unzipper.Extract({ path: outputDir });
  return new Promise((res, rej) => {
    fs.createReadStream(file).pipe(extractStream)
    .on("close", () => {
      console.log(`Archive decompressed in: ${outputDir}`);
      res()
    })
    .on("error", (err) => {
      console.error("Error during decompression:", err);
      rej(err)
    });
  })

  
}
