"use client"

import styles from "./page.module.css";
import MarkdownIt from "markdown-it";
import React from "react";

export default function Home() {

  const md = new MarkdownIt()

  React.useEffect(() => {
    const markdown = document.querySelector('main')
    markdown.innerHTML = "Aucune présentation n'est ouverte"
    window.api.onOpenFolder((data) => {
      console.log(data)
      markdown.innerHTML = md.render(data)
    })
  }, [])


  return (
    <div className={styles.page}>
      <main className={styles.main}>
      </main>
    </div>
  );
}
