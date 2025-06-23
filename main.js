import fs from "fs";
// import path from "path";
import unzipper from "unzipper";

function unZipFile(archivePath, outputDir) {
  if (!fs.existsSync(archivePath)) {
    console.error(".codeprez file cannot be found");
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const readStream = fs.createReadStream(archivePath);
  const extractStream = unzipper.Extract({ path: outputDir });

  readStream
    .pipe(extractStream)
    .on("close", () => {
      console.log(`Archive was decompressed in: ${outputDir}`);
    })
    .on("error", (err) => {
      console.error("Error during decompression:", err);
    });
}

const archivePath = process.argv[2];
const outputDir = process.argv[3];

if (!archivePath || !outputDir) {
  console.log("Usage: node main.js <archive_path.codeprez> <output_dir>");
  process.exit(1);
}

unZipFile(archivePath, outputDir);

// chercher dans archives
// envoyer dans presentation