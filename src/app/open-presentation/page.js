"use client";
import React from "react";
import MarkdownIt from "markdown-it";
import hljs from 'highlight.js';
import { useState } from "react";
import styles from "./page.module.css";
import { convertCode } from "../../../scripts/convertCode";

export default function Home() {
  const [content, setContent] = useState("");
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  const md = new MarkdownIt()

  React.useEffect(() => {
    (async () => {
      const listResult = await window.api.requestSlidesList();
      if (listResult.success && listResult.files.length > 0) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/style.css';
        document.head.appendChild(link);
        setSlides(listResult.files);
        setCurrent(0);
        const contentResult = await window.api.requestSlideContent(listResult.files[0]);
        if (contentResult.success) {
          setContent(contentResult.content);
          setTimeout(() => {
            hljs.configure({ classPrefix: "" });
            hljs.highlightAll();
          }, 0);
        }
      } else {
        setSlides([]);
        setContent("");
      }
    })();
    const handleKeyDown = (e) => {
      if (slides.length === 0) return;
      if (e.key === 'ArrowLeft') {
        if (current > 0) goToSlide(current - 1);
      } else if (e.key === 'ArrowRight') {
        if (current < slides.length - 1) goToSlide(current + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [current, slides]);

  const goToSlide = async (idx) => {
    if (slides.length === 0) return;
    const contentResult = await window.api.requestSlideContent(slides[idx]);
    if (contentResult.success) {
      setContent(contentResult.content);
      hljs.highlightAll()
      setCurrent(idx);
      setTimeout(() => {
        hljs.configure({ classPrefix: "" });
        hljs.highlightAll();
        convertCode(hljs)
      }, 1);
    }
  };

  return (
    <div className={styles.wholePage}>
      <a href="/" className={styles.logoLink}>
        <img src="./logo/codeprez-full-logo.png" alt="CodePrez Logo" style={{ width: "250px" }} />
      </a>

      <section id="presentation" className={styles.presentation} dangerouslySetInnerHTML={{ __html: content ? md.render(content) : "No opened presentations" }} />

      <div className={styles.presentationContainer}>
        <button onClick={() => goToSlide(Math.max(0, current - 1))} disabled={current === 0 || slides.length === 0}>&lt;</button>
        <button onClick={() => goToSlide(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1 || slides.length === 0}>&gt;</button>
      </div>
    </div>
  );
}
