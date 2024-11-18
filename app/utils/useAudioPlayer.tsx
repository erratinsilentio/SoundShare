"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

export interface TrackVersion {
  key: string;
  name: string;
  url: string;
}

interface UseAudioPlayerProps {
  containerRef: React.RefObject<HTMLElement>;
  currentVersion: TrackVersion | null;
  versions: TrackVersion[];
  darkMode: boolean;
}

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  wavesurfer: any | null;
  onPlayPause: () => void;
}

export const useAudioPlayer = ({
  containerRef,
  currentVersion,
  versions,
  darkMode,
}: UseAudioPlayerProps): UseAudioPlayerReturn => {
  const [duration, setDuration] = useState(0);

  // Waveform rendering function
  const renderFunction = useCallback(
    (channels: number[][], ctx: CanvasRenderingContext2D) => {
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
    },
    []
  );

  // WaveSurfer configuration
  const waveSurferConfig = useMemo(
    () => ({
      container: containerRef.current,
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
    [containerRef, renderFunction, currentVersion, versions, darkMode]
  );
  const { wavesurfer, isPlaying, currentTime } =
    // @ts-ignore
    useWavesurfer(waveSurferConfig);

  // Handle duration updates
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
    wavesurfer?.playPause();
  }, [wavesurfer]);

  return {
    isPlaying,
    currentTime,
    duration,
    wavesurfer,
    onPlayPause,
  };
};
