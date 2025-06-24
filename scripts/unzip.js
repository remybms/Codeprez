import fs from "fs";
import path from "path";
import unzipper from "unzipper";

const archivesDir = "./archives";
const outputDir = "./presentation";

function unZipFile(archivePath, outputDir) {
  if (!fs.existsSync(archivePath)) {
    console.error(".codeprez file cannot be found:", archivePath);
    return;
  }

//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

  const readStream = fs.createReadStream(archivePath);
  const extractStream = unzipper.Extract({ path: outputDir });

  readStream
    .pipe(extractStream)
    .on("close", () => {
      console.log(`Archive decompressed in: ${outputDir}`);
    })
    .on("error", (err) => {
      console.error("Error during decompression:", err);
    });
}

function getLatestFile() {
  if (!fs.existsSync(archivesDir)) {
    console.error("The folder 'archives/' is missing.");
    process.exit(1);
  }

  const files = fs.readdirSync(archivesDir)
    .filter(file => file.endsWith(".codeprez"))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(archivesDir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); 

  if (files.length === 0) {
    console.error("No .codeprez file found in 'archives/'");
    process.exit(1);
  }

  return path.join(archivesDir, files[0].name);
}

const archiveToUnzip = getLatestFile();
unZipFile(archiveToUnzip, outputDir);
