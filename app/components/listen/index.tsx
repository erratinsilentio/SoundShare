"use client";

import { UploadButton } from "@/app/utils/uploadthing";
import { useState, useEffect, useRef } from "react";
import { Music, Moon, Sun, Download, Upload, Copy, Check } from "lucide-react";
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

interface TrackVersion {
  key: string;
  name: string;
  url: string;
}

export default function SharePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<TrackVersion | null>(
    null
  );
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);

    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioContext(context);

    setCurrentVersion(versions[0]);

    return () => {
      context.close();
    };
  }, []);

  useEffect(() => {
    if (audioContext && currentVersion) {
      fetch(currentVersion.url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((buffer) => {
          setAudioBuffer(buffer);
          drawWaveform(buffer);
        })
        .catch((error) => {
          console.error("Error loading audio:", error);
          drawRandomWaveform();
        });
    }
  }, [audioContext, currentVersion]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
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

  const drawWaveform = (buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, amp);

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.lineTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }

    ctx.strokeStyle = darkMode ? "#4B5563" : "#9CA3AF";
    ctx.stroke();
  };

  const drawRandomWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const amp = height / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, amp);

    for (let i = 0; i < width; i++) {
      const y = Math.random() * height;
      ctx.lineTo(i, y);
    }

    ctx.strokeStyle = darkMode ? "#4B5563" : "#9CA3AF";
    ctx.stroke();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !audioRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickPosition = x / canvas.width;

    audioRef.current.currentTime = clickPosition * duration;
  };

  const handleVersionChange = (versionId: string) => {
    const newVersion = versions.find((v) => v.id === versionId);
    if (newVersion) {
      setCurrentVersion(newVersion);
      setIsPlaying(false);
      setCurrentTime(0);
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
            {currentVersion && (
              <audio
                ref={audioRef}
                src={currentVersion.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            )}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={100}
                className="w-full cursor-pointer"
                onClick={handleCanvasClick}
              />
              {currentVersion && (
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 opacity-30 pointer-events-none"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              )}
            </div>
            <div className="flex justify-between items-center">
              <Button
                onClick={togglePlayPause}
                disabled={!currentVersion}
                className="px-4"
                variant="outline"
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <div>
                {currentVersion
                  ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                  : "0:00 / 0:00"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                onValueChange={handleVersionChange}
                value={currentVersion?.key}
              >
                <SelectTrigger className="w-[180px]">
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
              <Button onClick={handleDownload} disabled={!currentVersion}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <UploadButton
                content={{
                  button({ ready }) {
                    if (ready)
                      return (
                        <Button className="flex flex-row gap-2 w-[300px] justify-center items-center">
                          <Upload className="mr-2 h-4 w-4" /> Upload New Version
                        </Button>
                      );
                  },
                }}
                appearance={{
                  allowedContent: "hidden",
                  button: "w-[200px] border-white bg-transparent",
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // setData({ key: res[0].key, name: res[0].name });
                  // setIsUploaded(true);
                  console.log("good");
                }}
                onUploadError={(error: Error) => {
                  alert(
                    `****! Looks like there was an error with uploading your track: ${error.message}`
                  );
                }}
              />
            </div>
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
