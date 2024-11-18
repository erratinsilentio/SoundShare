"use client";
import Clipboard from "./clipboard";
import { useWavesurfer } from "@wavesurfer/react";
import { UploadButton } from "@/app/utils/uploadthing";
import { useState, useCallback, useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Footer } from "../layout/footer";
import { ThemeToggle } from "../layout/theme-toggle";
import { Header } from "../layout/header";
import { useSearchParams } from "next/navigation";
import PlayButton from "./play-button";
import VersionSelect from "./version-select";
import PlayTime from "./play-time";
import DownloadUploadButtons from "./download-upload-buttons";

export interface TrackVersion {
  key: string;
  name: string;
  url: string;
}

export default function SharePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentVersion, setCurrentVersion] = useState<TrackVersion | null>(
    null
  );

  const containerRef = useRef(null);
  const [urlIndex, setUrlIndex] = useState(0);

  const params = useSearchParams();
  const currentName = params.get("name");
  const currentKey = params.get("key");
  const downloadUrl = `https://utfs.io/f/${currentKey}`;

  const [versions, setVersions] = useState<TrackVersion[]>([
    {
      key: currentKey || "",
      name: currentName || "",
      url: downloadUrl,
    },
    {
      key: "2",
      name: "Remix",
      url: "/placeholder2.mp3",
    },
  ]);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "rgb(96, 165, 250)",
    progressColor: "rgb(29, 78, 216)",
    url: versions[0].url,
  });

  const onUrlChange = useCallback(() => {
    setUrlIndex((index) => (index + 1) % versions.length);
  }, []);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const handleVersionChange = (versionId: string) => {
    const newVersion = versions.find((v) => v.key === versionId);
    if (newVersion) {
      setCurrentVersion(newVersion);
    }
  };

  const handleDownload = () => {
    if (currentVersion) {
      const link = document.createElement("a");
      link.href = currentVersion.url;
      link.download = `${currentVersion.name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newVersion: TrackVersion = {
        key: (versions.length + 1).toString(),
        name: `Version ${versions.length + 1}`,
        url: URL.createObjectURL(file),
      };
      setVersions([...versions, newVersion]);
      setCurrentVersion(newVersion);
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-zinc-900" : "bg-white"
      } overflow-hidden relative`}
    >
      <Header darkMode={darkMode} />
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className={`${darkMode ? "bg-zinc-800 text-white" : ""}`}>
          <CardHeader>
            <CardTitle>
              {currentVersion ? currentVersion.name : "No Track Selected"}
            </CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : ""}>
              Select a track to play
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* WAVEFORM */}
            <div ref={containerRef}></div>
            {/* PLAY BUTTON */}
            <PlayTime
              darkMode={darkMode}
              isPlaying={isPlaying}
              currentVersion={currentVersion}
              onPlayPause={onPlayPause}
              currentTime={currentTime}
              duration={duration}
            />
            <div className="flex items-center space-x-2 gap-4 pr-6">
              {/* CURRENT VERSION SELECT */}
              <VersionSelect
                currentVersion={currentVersion}
                versions={versions}
                handleVersionChange={handleVersionChange}
              />
              {/* DOWNLOAD AND UPLOAD BUTTONS */}
              <DownloadUploadButtons
                darkMode={darkMode}
                setVersions={setVersions}
                versions={versions}
                currentVersion={currentVersion}
                handleDownload={handleDownload}
              />
            </div>
            {/* COPY TO CLIPBOARD */}
            <Clipboard darkMode={darkMode} currentVersion={currentVersion} />
          </CardContent>
        </Card>
      </motion.div>

      <Footer darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
    </main>
  );
}
