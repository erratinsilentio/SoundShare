import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudioWaveform } from "./audio-waveform";
import { ShareLink } from "./share-link";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import { $darkMode } from "@/store/store";

interface AudioPlayerProps {
  songUrl: string;
  songName: string | null;
  shareUrl?: string;
}

export const AudioPlayer = ({
  songUrl,
  songName,
  shareUrl,
}: AudioPlayerProps) => {
  const darkMode = useStore($darkMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTrackLoaded, setIsTrackLoaded] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioContext(context);

    return () => {
      context.close();
    };
  }, []);

  useEffect(() => {
    if (audioContext && audioRef.current) {
      fetch(songUrl)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((buffer) => {
          setAudioBuffer(buffer);
          setIsTrackLoaded(true);
        })
        .catch((error) => {
          console.error("Error loading audio:", error);
        });
    }
  }, [audioContext]);

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

  const handlePositionChange = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        className={`w-full max-w-md ${
          darkMode ? "bg-zinc-800 text-white" : ""
        }`}
      >
        <CardHeader>
          <CardTitle>{isTrackLoaded ? songName : "No Track Loaded"}</CardTitle>
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
              src={songUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          )}
          <AudioWaveform
            audioBuffer={audioBuffer}
            currentTime={currentTime}
            duration={duration}
            darkMode={darkMode}
            isTrackLoaded={isTrackLoaded}
            onPositionChange={handlePositionChange}
          />
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
          <ShareLink shareUrl={shareUrl} />
        </CardContent>
      </Card>
    </motion.div>
  );
};
