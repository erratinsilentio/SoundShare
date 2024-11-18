"use client";
import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

interface WaveSurferProps {
  url: string;
  darkMode: boolean;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlayPause?: (isPlaying: boolean) => void;
}

export const WaveSurfer: React.FC<WaveSurferProps> = ({
  url,
  darkMode,
  onReady,
  onTimeUpdate,
  onDurationChange,
  onPlayPause,
}) => {
  const containerRef = useRef(null);
  const [duration, setDuration] = useState(0);

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

  const waveSurferConfig = useMemo(
    () => ({
      container: containerRef.current,
      height: 100,
      waveColor: darkMode ? "rgb(236, 72, 153, 0.9)" : "rgb(192, 38, 211)",
      progressColor: "rgb(29, 78, 216)",
      url,
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
    [containerRef, renderFunction, url, darkMode]
  );

  const { wavesurfer, isPlaying, currentTime } =
    useWavesurfer(waveSurferConfig);

  useEffect(() => {
    if (wavesurfer) {
      const handleReady = () => {
        const duration = wavesurfer.getDuration();
        setDuration(duration);
        onDurationChange?.(duration);
        onReady?.();
      };

      const handleTimeUpdate = () => {
        onTimeUpdate?.(wavesurfer.getCurrentTime());
      };

      const handlePlay = () => {
        onPlayPause?.(true);
      };

      const handlePause = () => {
        onPlayPause?.(false);
      };

      wavesurfer.on("ready", handleReady);
      wavesurfer.on("audioprocess", handleTimeUpdate);
      wavesurfer.on("play", handlePlay);
      wavesurfer.on("pause", handlePause);

      return () => {
        wavesurfer.un("ready", handleReady);
        wavesurfer.un("audioprocess", handleTimeUpdate);
        wavesurfer.un("play", handlePlay);
        wavesurfer.un("pause", handlePause);
      };
    }
  }, [wavesurfer, onReady, onTimeUpdate, onDurationChange, onPlayPause]);

  return <div ref={containerRef} className="pt-4 pb-2" />;
};
