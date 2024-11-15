"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LoadingPage() {
  const [darkMode, setDarkMode] = useState(true);

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

  const dotVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-zinc-900" : "bg-white"
      }`}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className={`text-4xl font-bold bg-gradient-to-r ${
            darkMode ? "from-blue-400 to-pink-400" : "from-blue-600 to-pink-500"
          } text-transparent bg-clip-text`}
        >
          Loading
          <motion.span
            initial="hidden"
            animate="visible"
            transition={{ ...dotTransition, delay: 0 }}
            variants={dotVariants}
          >
            .
          </motion.span>
          <motion.span
            initial="hidden"
            animate="visible"
            transition={{ ...dotTransition, delay: 0.2 }}
            variants={dotVariants}
          >
            .
          </motion.span>
          <motion.span
            initial="hidden"
            animate="visible"
            transition={{ ...dotTransition, delay: 0.4 }}
            variants={dotVariants}
          >
            .
          </motion.span>
        </h1>
        {/* <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Please wait while we prepare your experience
        </p> */}
      </motion.div>

      <motion.footer
        className={`mt-8 text-center ${
          darkMode ? "text-gray-400" : "text-gray-500"
        } text-sm`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        &copy; 2024 SoundShare. All rights reserved.
      </motion.footer>

      <Button
        className={`fixed top-4 right-4 p-2 rounded-full ${
          darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-800"
        }`}
        onClick={toggleDarkMode}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </main>
  );
}
