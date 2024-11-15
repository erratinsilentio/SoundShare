"use client";
import { UploadButton } from "@/app/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Music, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
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

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-zinc-900" : "bg-white"
      }`}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-2">
          <Music
            className={`h-8 w-8 ${
              darkMode ? "text-pink-400" : "text-pink-500"
            } mr-2`}
          />
          <h1
            className={`text-4xl font-bold bg-gradient-to-r ${
              darkMode
                ? "from-blue-400 to-pink-400"
                : "from-blue-600 to-pink-500"
            } text-transparent bg-clip-text`}
          >
            SoundShare
          </h1>
        </div>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Share your music with the world
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="sm:w-[350px]"
      >
        <Card
          className={`w-full max-w-md ${
            darkMode ? "bg-zinc-800 text-white" : ""
          }`}
        >
          <CardHeader className="text-center sm:text-left">
            <CardTitle>Upload Your Music</CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : ""}>
              Select an audio file to share
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <UploadButton
                appearance={{
                  button: `bg-gradient-to-r ${
                    darkMode
                      ? "from-blue-500 to-pink-400 hover:from-blue-600 hover:to-pink-500"
                      : "from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600"
                  } text-white`,
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  console.log("Files: ", res[0]);
                  router.push(`/listen?key=${res[0].key}&name=${res[0].name}`);
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(
                    `****! Looks like there was an error with uploading your track: ${error.message}`
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>
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
