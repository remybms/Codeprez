"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [markdown, setMarkdown] = useState("");
  const [css, setCss] = useState("");
  const [assets, setAssets] = useState("");
  const [env, setEnv] = useState("");
  const [title, setTitle] = useState("");
  
  const selectFile = async (options) => {
    return await window.electronAPI.selectFile(options);
  };
  
  const handleSubmit = async () => {
    const outputDir = await selectFile({ properties: ["openDirectory"] });
    if (!outputDir) return;
    
    const result = await window.electronAPI.createArchive({
      markdownPath: markdown,
      cssPath: css,
      assetsPath: assets,
      envPath: env,
      outputDir,
      metadata: { title },
    });
    
    if (result.success) {
      alert(".codeprez archive created !");
    } else {
      alert("Error: " + result.error);
    }
  };
  
  return (
    <div className={styles.wholePage}>
      <a href="/" className={styles.logoLink}>
        <img src="./logo/codeprez-full-logo.png" alt="CodePrez Logo" style={{ width: "250px"}} />
      </a>
      
      <div className={styles.createArchiveContainer}>
        <h1>Make a .codeprez archive</h1>
        <label>
        Title of the presentation :
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        
        <button onClick={async () => setMarkdown(await selectFile({ properties: ["openFile"] }))}>
        Select presentation.md
        </button>
        <span>{markdown}</span><br />
        
        <button onClick={async () => setCss(await selectFile({ properties: ["openFile"] }))}>
        Select style.css
        </button>
        <span>{css}</span><br />
        
        <button onClick={async () => setAssets(await selectFile({ properties: ["openDirectory"] }))}>
        Select assets folder
        </button>
        <span>{assets}</span><br />
        
        <button onClick={async () => setEnv(await selectFile({ properties: ["openDirectory"] }))}>
        Select env folder
        </button>
        <span>{env}</span>

        <div className={styles.createArchiveBtn}>
          <button onClick={handleSubmit}>Create .codeprez</button>
        </div>
      </div>
    </div>
  );
}
