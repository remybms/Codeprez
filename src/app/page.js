"use client";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();
  
  return (
    <main>   
      <h1>Welcome to CodePrez</h1> 
      <br/>
      <img src="/logo/codeprez-full-logo.png" alt="CodePrez Logo" style={{ width: "200px"}} />
      <br/>
      <br/>
      <button
      onClick={() => router.push("/create-archive")}>
      Create an archive
      </button>    
    </main>
  );
}
