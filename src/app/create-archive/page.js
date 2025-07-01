"use client";
import { useState } from "react";

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
    <div>
      <h1>Créer une archive .codeprez</h1>
      <label>
        Titre de la présentation :
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <br /><br />

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
      <span>{env}</span><br /><br />

      <button onClick={handleSubmit}>Create .codeprez</button>
    </div>
  );
}
