"use client";
import React from "react";
import MarkdownIt from "markdown-it";
import hljs from 'highlight.js';
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [content, setContent] = useState("");
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  const md = React.useMemo(() => new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return '';
    }
  }), []);

  React.useEffect(() => {
    (async () => {
      const listResult = await window.api.requestSlidesList();
      if (listResult.success && listResult.files.length > 0) {
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
  }, []);

  const goToSlide = async (idx) => {
    if (slides.length === 0) return;
    const contentResult = await window.api.requestSlideContent(slides[idx]);
    if (contentResult.success) {
      setContent(contentResult.content);
      setCurrent(idx);
      setTimeout(() => {
        hljs.configure({ classPrefix: "" });
        hljs.highlightAll();
      }, 0);
    }
  };

  return (
    <div className={styles.wholePage}>
      <a href="/" className={styles.logoLink}>
        <img src="./logo/codeprez-full-logo.png" alt="CodePrez Logo" style={{ width: "250px"}} />
      </a>
      
      <div>
        <h2>Presentation mode</h2>
        <div style={{marginBottom: '1rem'}}>
          <button onClick={() => goToSlide(Math.max(0, current - 1))} disabled={current === 0 || slides.length === 0}>Previous</button>
          <button onClick={() => goToSlide(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1 || slides.length === 0}>Next</button>
        </div>
        <div id="presentation" dangerouslySetInnerHTML={{ __html: content ? md.render(content) : "No opened presentations" }} />
      </div>
    </div>
  );
}
