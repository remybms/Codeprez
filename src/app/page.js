"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <main>   
      <h1>Welcome to CodePrez</h1> 
      <button
      onClick={() => router.push("/create-archive")}>
      Create an archive
      </button>
    </main>
  );
}
