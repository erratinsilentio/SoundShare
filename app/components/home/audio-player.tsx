import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShareLink } from "./share-link";
import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import { $darkMode } from "@/store/store";
import PlayTime from "../listen/play-time";
import { useAudioPlayer } from "@/app/utils/useAudioPlayer";
import { TrackVersion } from "../listen";

interface AudioPlayerProps {
  songKey: string | undefined;
  songUrl: string;
  songName: string | null;
  shareUrl?: string;
}

export const AudioPlayer = ({
  songKey,
  songUrl,
  songName,
  shareUrl,
}: AudioPlayerProps) => {
  const containerRef = useRef(null);
  const darkMode = useStore($darkMode);
  const [duration, setDuration] = useState(0);
  const [isTrackLoaded, setIsTrackLoaded] = useState(true);
  const [currentVersion, setCurrentVersion] = useState<TrackVersion | null>({
    key: songKey || "",
    name: songName || "",
    url: songUrl,
  });

  const [versions, setVersions] = useState<TrackVersion[]>([
    {
      key: currentVersion?.key || "",
      name: currentVersion?.name || "",
      url: currentVersion?.url || "",
    },
  ]);

  const { wavesurfer, isPlaying, currentTime } = useAudioPlayer({
    containerRef,
    currentVersion,
    versions,
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

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

  return (
    <motion.div
      className="relative z-10 w-full flex justify-center"
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
          <div ref={containerRef} className="pt-4 pb-2"></div>
          <div className="flex justify-between items-center">
            <PlayTime
              isPlaying={isPlaying}
              currentVersion={currentVersion}
              onPlayPause={onPlayPause}
              currentTime={currentTime}
              duration={duration}
            />
          </div>
          <ShareLink shareUrl={shareUrl} />
        </CardContent>
      </Card>
    </motion.div>
  );
};
