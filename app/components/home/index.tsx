"use client";
import { useState, useEffect } from "react";
import { ThemeToggle } from "../layout/theme-toggle";
import { Footer } from "../layout/footer";
import { Header } from "../layout/header";
import { UploadCard } from "./upload-card";
import { AudioPlayer } from "./audio-player";
import { useRouter } from "next/navigation";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);
  const [data, setData] = useState<
    { key: string; name: string } | null | undefined
  >(null);

  const songUrl = `https://utfs.io/f/${data?.key}`;
  const songName = data?.name || "Untitled";
  const shareUrl = `http://localhost:3000/listen?key=${data?.key}&name=${songName}`;

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-zinc-900" : "bg-white"
      }`}
    >
      <Header darkMode={darkMode} />
      {!isUploaded ? (
        <UploadCard
          darkMode={darkMode}
          setIsUploaded={setIsUploaded}
          setData={setData}
        />
      ) : (
        <AudioPlayer
          darkMode={darkMode}
          songUrl={songUrl}
          songName={songName}
          shareUrl={shareUrl}
        />
      )}

      <Footer darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
    </main>
  );
}
