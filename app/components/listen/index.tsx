"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "./header";
import { AudioPlayer } from "./audio-player";
import { ThemeToggle } from "./theme-toggle";

export default function ListenPage(props: {
  searchParams?: Promise<{
    key?: number;
    name?: string;
  }>;
}) {
  const [darkMode, setDarkMode] = useState(false);
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

      <Suspense>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AudioPlayer
            darkMode={darkMode}
            songUrl={songUrl}
            songName={songName}
          />
        </motion.div>
      </Suspense>

      <motion.footer
        className={`mt-8 text-center ${
          darkMode ? "text-gray-400" : "text-gray-500"
        } text-sm relative z-10`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        &copy; 2024 SoundShare. All rights reserved.
      </motion.footer>

      <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
    </main>
  );
}
