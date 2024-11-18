"use client";
import Clipboard from "./clipboard";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import { useWavesurfer } from "@wavesurfer/react";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
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

export interface TrackVersion {
  key: string;
  name: string;
  url: string;
}

export default function SharePage() {
  const darkMode = useStore($darkMode);
  const [duration, setDuration] = useState(0);
  const [currentVersion, setCurrentVersion] = useState<TrackVersion | null>(
    null
  );

  const containerRef = useRef(null);

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

  // @ts-ignore
  const renderFunction = useCallback((channels, ctx) => {
    const { width, height } = ctx.canvas;
    const scale = channels[0].length / width;
    const step = 10;

    ctx.translate(0, height / 2);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();

    for (let i = 0; i < width; i += step * 2) {
      const index = Math.floor(i * scale);
      const value = Math.abs(channels[0][index]);
      let x = i;
      let y = value * height;

      ctx.moveTo(x, 0);
      ctx.lineTo(x, y);
      ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
      ctx.lineTo(x + step, 0);

      x = x + step;
      y = -y;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, y);
      ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
      ctx.lineTo(x + step, 0);
    }

    ctx.stroke();
    ctx.closePath();
  }, []);

  const waveSurferConfig = useMemo(
    () => ({
      container: containerRef,
      height: 100,
      waveColor: darkMode ? "rgb(236, 72, 153, 0.9)" : "rgb(192, 38, 211)",
      progressColor: "rgb(29, 78, 216)",
      url: currentVersion ? currentVersion.url : versions[0].url,
      plugins: [
        Hover.create({
          lineColor: "#1e3a8a",
          lineWidth: 0.9,
          labelBackground: "#555",
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
      renderFunction,
    }),
    [containerRef, renderFunction, currentVersion]
  );

  const { wavesurfer, isPlaying, currentTime } =
    useWavesurfer(waveSurferConfig);

  // Add effect to handle duration updates
  useEffect(() => {
    if (wavesurfer) {
      // Set initial duration when wavesurfer is ready
      const handleReady = () => {
        setDuration(wavesurfer.getDuration());
      };

      // Update duration when loading new audio
      const handleLoading = () => {
        setDuration(0); // Reset duration while loading
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
            darkMode={darkMode}
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
              darkMode={darkMode}
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
