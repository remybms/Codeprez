"use client"

import styles from "./page.module.css";
import MarkdownIt from "markdown-it";
import React from "react";
import hljs from 'highlight.js'

export default function Home() {

  const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return '';
  }
});

  React.useEffect(() => {
    let openedFile = "";
    const markdown = document.querySelector('#presentation')
    const slidesList = document.querySelector("ul")
    markdown.innerHTML = "Aucune présentation n'est ouverte"
    window.api.onOpenFolder((data, files) => {
      md.options.highlight()
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/style.css';
      document.head.appendChild(link);
      markdown.innerHTML = md.render(data)
      slidesList.innerHTML = ""
      for (const slide of files) {
        const li = document.createElement("li")
        li.textContent = slide
        slidesList.append(li)
        li.addEventListener("click", () => {
          window.api.openFile(slide);
          openedFile = slide;
        });
      }
    })

    window.api.onFileContent((content) => {
      markdown.innerHTML = md.render(content)
    })
  }, [])


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <nav className={styles.nav}><ul className={styles.list}></ul></nav>
        <div id="presentation" className={styles.presentation}></div>
      </main>
    </div>
  );
}
