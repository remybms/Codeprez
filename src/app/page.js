"use client";
import { useRouter } from "next/navigation"; 
// import styles from "./globals.css";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className={styles.wholePage}>   
    <a href="/" className={styles.logoLink}>
      <img src="./logo/codeprez-full-logo.png" alt="CodePrez Logo" style={{ width: "250px"}} />
    </a>
    <h1>Welcome to CodePrez</h1> 
    <br/>
    <br/>
    <br/>
    {/* <button
      onClick={() => router.push("/create-archive")}>
      Create an archive
      </button>     */}
      </div>
    );
  }
  