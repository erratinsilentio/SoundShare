import { $darkMode } from "@/store/store";
import { useStore } from "@nanostores/react";
import { useWavesurfer } from "@wavesurfer/react";
import { MutableRefObject, useCallback, useMemo } from "react";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import { TrackVersion } from "../components/listen";

interface WaveSurferProps {
  containerRef: MutableRefObject<null>;
  currentVersion: TrackVersion | null;
  versions: TrackVersion[];
}

export const useAudioPlayer = ({
  containerRef,
  currentVersion,
  versions,
}: WaveSurferProps) => {
  const darkMode = useStore($darkMode);
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
        HoverPlugin.create({
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

  return {
    wavesurfer,
    isPlaying,
    currentTime,
  };
};
