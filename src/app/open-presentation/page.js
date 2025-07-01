"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  
  return (
    <div className={styles.wholePage}>
      <a href="/" className={styles.logoLink}>
        <img src="./logo/codeprez-full-logo.png" alt="CodePrez Logo" style={{ width: "250px"}} />
      </a>
      
      <div >
        <h2>Presentation mode</h2>
        {/* /slides -> .md */}
      

        <div >
          {/* <button onClick={handleSubmit}>Create .codeprez</button> */}
        </div>
      </div>
    </div>
  );
}
