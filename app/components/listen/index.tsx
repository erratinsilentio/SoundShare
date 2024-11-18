"use client";
import { useWavesurfer } from "@wavesurfer/react";
import { UploadButton } from "@/app/utils/uploadthing";
import { useState, useCallback, useRef } from "react";
import { Download, Upload, Copy, Check, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Footer } from "../layout/footer";
import { ThemeToggle } from "../layout/theme-toggle";
import { Header } from "../layout/header";
import { useSearchParams } from "next/navigation";
import PlayButton from "./play-button";

export interface TrackVersion {
  key: string;
  name: string;
  url: string;
}

export default function SharePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [duration, setDuration] = useState(0);
  const [copied, setCopied] = useState(false);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://soundshare.com/share/${currentVersion?.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="flex justify-between items-center">
              <PlayButton
                isPlaying={isPlaying}
                currentVersion={currentVersion}
                onPlayPause={onPlayPause}
              />
              {/* SONG DURATION */}
              <div>
                {currentVersion
                  ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                  : "0:00 / 0:00"}
              </div>
            </div>
            <div className="flex items-center space-x-2 gap-4 pr-6">
              {/* CURRENT VERSION SELECT */}
              <Select
                onValueChange={handleVersionChange}
                value={currentVersion?.key}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.key} value={version.key}>
                      {version.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="w-1/2 flex flex-row items-center justify-center gap-2">
                {/* DOWNLOAD BUTTON */}
                <Button onClick={handleDownload} disabled={!currentVersion}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                {/* UPLOAD BUTTON */}
                <UploadButton
                  content={{
                    button({ ready }) {
                      if (ready)
                        return (
                          <span
                            className={`flex flex-row gap-2 w-[300px] justify-center items-center ${
                              darkMode ? "text-white" : "text-black"
                            }`}
                          >
                            <Upload className="mr-1 h-4 w-4" /> Upload New
                            Version
                          </span>
                        );
                    },
                  }}
                  appearance={{
                    allowedContent: "hidden",
                    button: `w-[200px] border-white bg-transparent ${
                      darkMode ? "text-white" : ""
                    }`,
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setVersions([
                      ...versions,
                      {
                        key: res[0].key,
                        name: res[0].name,
                        url: `https://utfs.io/f/${res[0].key}`,
                      },
                    ]);
                    console.log("good");
                  }}
                  onUploadError={(error: Error) => {
                    alert(
                      `****! Looks like there was an error with uploading your track: ${error.message}`
                    );
                  }}
                />
              </div>
            </div>
            {/* COPY TO CLIPBOARD */}
            <div className="flex items-center space-x-2">
              <Input
                value={
                  currentVersion
                    ? `https://soundshare.com/share/${currentVersion.key}`
                    : ""
                }
                readOnly
                className={`flex-grow ${
                  darkMode ? "bg-gray-700 text-white" : ""
                }`}
              />
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Footer darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
    </main>
  );
}
