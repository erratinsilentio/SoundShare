"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "../layout/header";
import { AudioPlayer } from "./audio-player";
import { ThemeToggle } from "../layout/theme-toggle";
import { Footer } from "../layout/footer";

export default function ListenPage(props: {
  searchParams?: Promise<{
    key?: number;
    name?: string;
  }>;
}) {
  const [darkMode, setDarkMode] = useState(true);
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const songName = searchParams.get("name");
  const songUrl = `https://utfs.io/f/${key}`;

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

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
      } overflow-hidden relative`}
    >
      <Header darkMode={darkMode} />

      <AudioPlayer darkMode={darkMode} songUrl={songUrl} songName={songName} />

      <Footer darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
    </main>
  );
}
