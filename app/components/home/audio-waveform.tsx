import { useRef, useEffect } from "react";

interface AudioWaveformProps {
  audioBuffer: AudioBuffer | null;
  currentTime: number;
  duration: number;
  darkMode: boolean;
  isTrackLoaded: boolean;
  onPositionChange: (position: number) => void;
}

export const AudioWaveform = ({
  audioBuffer,
  currentTime,
  duration,
  darkMode = true,
  isTrackLoaded,
  onPositionChange,
}: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audioBuffer) {
      drawWaveform(audioBuffer);
    } else {
      drawRandomWaveform();
    }
  }, [audioBuffer, darkMode]);

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
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickPosition = x / canvas.width;

    onPositionChange(clickPosition * duration);
  };

  return (
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
  );
};
