"use client";

import { useState, useEffect, useRef } from "react";
import { Music, Moon, Sun, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ListenPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isTrackLoaded, setIsTrackLoaded] = useState(false);
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

    return () => {
      context.close();
    };
  }, []);

  useEffect(() => {
    if (audioContext && audioRef.current) {
      fetch("/placeholder.mp3")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((buffer) => {
          setAudioBuffer(buffer);
          setIsTrackLoaded(true);
          drawWaveform(buffer);
        })
        .catch((error) => {
          console.error("Error loading audio:", error);
          drawRandomWaveform();
        });
    } else {
      drawRandomWaveform();
    }
  }, [audioContext, darkMode]);

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
    navigator.clipboard.writeText("https://soundshare.com/listen/abc123");
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
    if (!isTrackLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas || !audioRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickPosition = x / canvas.width;

    audioRef.current.currentTime = clickPosition * duration;
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-white"
      } overflow-hidden relative`}
    >
      {/* Granular mesh gradient */}
      <div
        className={`absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20 pointer-events-none`}
        style={{
          backgroundImage: `
            radial-gradient(at 100% 100%, 
              ${
                darkMode ? "rgb(59, 130, 246, 0.3)" : "rgb(37, 99, 235, 0.2)"
              } 0%, 
              ${
                darkMode ? "rgb(236, 72, 153, 0.3)" : "rgb(219, 39, 119, 0.2)"
              } 50%, 
              transparent 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
          `,
          backgroundBlendMode: "overlay",
          mixBlendMode: "overlay",
        }}
      />

      <motion.div
        className="text-center mb-8 relative z-10"
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
          Listen and share your music
        </p>
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          className={`w-full max-w-md ${
            darkMode ? "bg-gray-800 text-white" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>
              {isTrackLoaded ? "Now Playing" : "No Track Loaded"}
            </CardTitle>
            <CardDescription className={darkMode ? "text-gray-300" : ""}>
              {isTrackLoaded
                ? "Your uploaded track"
                : "Upload a track to start listening"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTrackLoaded && (
              <audio
                ref={audioRef}
                src="/placeholder.mp3"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            )}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={100}
                className={`w-full ${
                  isTrackLoaded ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={handleCanvasClick}
              />
              {isTrackLoaded && (
                <div
                  className="absolute top-0 left-0 h-full bg-blue-500 opacity-30 pointer-events-none"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              )}
            </div>
            <div className="flex justify-between items-center">
              <Button
                onClick={togglePlayPause}
                variant="outline"
                disabled={!isTrackLoaded}
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <div>
                {isTrackLoaded
                  ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                  : "0:00 / 0:00"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                value="https://soundshare.com/listen/abc123"
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

      <Button
        className={`fixed top-4 right-4 p-2 rounded-full ${
          darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-800"
        } z-20`}
        onClick={toggleDarkMode}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </main>
  );
}
