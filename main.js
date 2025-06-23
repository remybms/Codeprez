import fs from "fs";
import path from "path";
import unzipper from "unzipper";

async function unZipFile(archivePath, outputDir) {
  try {
    if (!fs.existsSync(archivePath)) {
      throw new Error(".codeprez file cannot be found");
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await fs
      .createReadStream(archivePath)
      .pipe(unzipper.Extract({ path: outputDir }))
      .promise();

    console.log(`Archive was decompressed in : ${outputDir}`);
  } catch (err) {
    console.error("Error during the decompression :", err);
  }
}

const archivePath = process.argv[2]; 
const outputDir = process.argv[3];   

if (!archivePath || !outputDir) {
  console.log("Usage: node main.js <archive_path.codeprez> <output_dir>");
  process.exit(1);
}

unZipFile(archivePath, outputDir);

