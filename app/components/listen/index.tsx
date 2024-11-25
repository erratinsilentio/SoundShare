"use client";
import Clipboard from "./clipboard";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import VersionSelect from "./version-select";
import PlayTime from "./play-time";
import DownloadUploadButtons from "./download-upload-buttons";
import { useStore } from "@nanostores/react";
import { $darkMode } from "@/store/store";
import { useAudioPlayer } from "@/app/utils/useAudioPlayer";

export interface TrackVersion {
  key: string;
  name: string;
  url: string;
}

export default function SharePage() {
  const darkMode = useStore($darkMode);
  const [duration, setDuration] = useState(0);
  const [currentVersion, setCurrentVersion] = useState<TrackVersion | null>(
    null,
  );

  const containerRef = useRef(null);
  // const [loading, setLoading] = useState(false);
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
      key: "MQITZdAV8rC2orzY2WmlDedOapBXvSlLn48yI90QfqKjt5Ez",
      name: "Remix",
      url: "https://utfs.io/f/MQITZdAV8rC2orzY2WmlDedOapBXvSlLn48yI90QfqKjt5Ez",
    },
  ]);

  const { wavesurfer, isPlaying, currentTime } = useAudioPlayer({
    containerRef,
    currentVersion,
    versions,
  });

  // Add effect to handle duration updates
  useEffect(() => {
    if (wavesurfer) {
      const handleReady = () => {
        setDuration(wavesurfer.getDuration());
      };

      const handleLoading = () => {
        setDuration(0);
      };

      wavesurfer.on("ready", handleReady);
      wavesurfer.on("loading", handleLoading);

      return () => {
        wavesurfer.un("ready", handleReady);
        wavesurfer.un("loading", handleLoading);
      };
    }
  }, [wavesurfer]);

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

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
    <motion.div
      className="relative z-10 w-full max-w-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        className={`${
          darkMode
            ? "bg-zinc-800 text-white"
            : "bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-indigo-100"
        }`}
      >
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
          <div ref={containerRef} className="pt-4 pb-2"></div>
          {/* PLAY BUTTON */}
          <PlayTime
            isPlaying={isPlaying}
            currentVersion={currentVersion}
            onPlayPause={onPlayPause}
            currentTime={currentTime}
            duration={duration}
          />
          <section className="flex items-center space-x-2 gap-4 pr-6">
            {/* CURRENT VERSION SELECT */}
            <VersionSelect
              currentVersion={currentVersion}
              versions={versions}
              handleVersionChange={handleVersionChange}
            />
            {/* DOWNLOAD AND UPLOAD BUTTONS */}
            <DownloadUploadButtons
              setVersions={setVersions}
              versions={versions}
              currentVersion={currentVersion}
              handleDownload={handleDownload}
            />
          </section>
          {/* COPY TO CLIPBOARD */}
          <Clipboard darkMode={darkMode} currentVersion={currentVersion} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
