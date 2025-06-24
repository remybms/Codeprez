import fs from "fs";
import unzipper from "unzipper";
import { separate } from "./separate.js";

export function unZipFile(file, outputDir) {
  const extractStream = unzipper.Extract({ path: outputDir });

  fs.createReadStream(file).pipe(extractStream)
    .on("close", () => {
      console.log(`Archive decompressed in: ${outputDir}`);
      separate()
    })
    .on("error", (err) => {
      console.error("Error during decompression:", err);
    });
}
