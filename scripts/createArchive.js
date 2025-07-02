import fs from "fs";
import path from "path";
import archiver from "archiver";

export function createCodePrezArchive({ markdownPath, cssPath, assetsPath, envPath, metadata, outputDir }) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(markdownPath) || !fs.existsSync(cssPath)) {
      return reject(new Error(".md or .css file is missing"));
    }
    
    const archiveName = `${metadata.title.replace(/\s+/g, "_")}.codeprez`;
    const archivePath = path.join(outputDir, archiveName);
    
    const output = fs.createWriteStream(archivePath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    
    output.on("close", () => {
      resolve();
    });
    
    archive.on("error", (err) => reject(err));
    
    archive.pipe(output);
    
    // add files
    archive.file(markdownPath, { name: "presentation.md" });
    archive.file(cssPath, { name: "style.css" });
    
    // add folders
    if (assetsPath) {
      archive.directory(assetsPath, "assets");
    }
    if (envPath) {
      archive.directory(envPath, "env");
    }
    // add config.json
    archive.append(JSON.stringify(metadata, null, 2), { name: "config.json" });
    
    archive.finalize();
  });
}
